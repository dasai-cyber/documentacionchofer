import { google } from "googleapis";
import { Readable } from "stream";

// Variables de entorno para Google Drive
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;
const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

export const isGoogleDriveConfigured = Boolean(
  clientEmail && privateKey && parentFolderId
);

/**
 * Obtiene el cliente autenticado de Google Drive usando cuenta de servicio
 */
function getDriveClient() {
  if (!isGoogleDriveConfigured) return null;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

interface UploadDriverToDrivePayload {
  conductorData: any;
  documents: { title: string; base64?: string; filename?: string }[];
  id: string;
}

/**
 * Convierte Base64 dataUrl a un Stream legible para Google Drive API
 */
function dataUrlToStream(dataUrl: string): { stream: Readable; mimeType: string } {
  const [header, base64Content] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const buffer = Buffer.from(base64Content, "base64");

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return { stream, mimeType };
}

/**
 * Crea una carpeta en Google Drive y sube todos los documentos del conductor
 * Retorna el enlace web a la carpeta de Google Drive
 */
export async function uploadDriverDossierToGoogleDrive(
  payload: UploadDriverToDrivePayload
): Promise<string | null> {
  const { conductorData, documents, id } = payload;
  const drive = getDriveClient();

  if (!drive || !parentFolderId) {
    console.info(
      `[GOOGLE DRIVE MOCK] Para subir a Drive, configura GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY y GOOGLE_DRIVE_FOLDER_ID en tu .env.local o Vercel.`
    );
    return null;
  }

  try {
    // 1. Crear carpeta con el nombre del conductor
    const folderName = `${conductorData.rut} - ${conductorData.nombre_completo}`;
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };

    const folderResponse = await drive.files.create({
      requestBody: folderMetadata,
      fields: "id, webViewLink",
    });

    const driverFolderId = folderResponse.data.id;
    const folderWebViewLink = folderResponse.data.webViewLink || `https://drive.google.com/drive/folders/${driverFolderId}`;

    if (!driverFolderId) {
      throw new Error("No se pudo crear la carpeta en Google Drive");
    }

    // 2. Crear archivo de texto con el resumen de la ficha
    const resumenText = `
=====================================================
FICHA DE REGISTRO DE CONDUCTOR — DASAI LOGÍSTICA
=====================================================
Folio: ${id}
Fecha de Registro: ${new Date().toLocaleString("es-CL")}

1. DATOS PERSONALES
-----------------------------------------------------
Nombre Completo:     ${conductorData.nombre_completo}
RUT:                 ${conductorData.rut}
Correo Electrónico:  ${conductorData.email}
Teléfono Principal:  ${conductorData.telefono_principal}
Teléfono Secundario: ${conductorData.telefono_secundario || "No registra"}
Dirección:           ${conductorData.direccion}
Comuna:              ${conductorData.comuna}
Estado Civil:        ${conductorData.estado_civil}
Nivel de Estudios:   ${conductorData.estudios_alcanzados}

2. DATOS BANCARIOS
-----------------------------------------------------
Banco:               ${conductorData.banco}
Tipo de Cuenta:      ${conductorData.tipo_cuenta}
Número de Cuenta:    ${conductorData.numero_cuenta}

3. MODALIDAD Y EQUIPAMIENTO
-----------------------------------------------------
Modalidad:           ${conductorData.registra_empresa ? "Empresa Registrada" : "Persona Natural (Comodato Notarial)"}
Dispone de GPS:      ${conductorData.tiene_gps ? "SÍ" : "NO"}
Dispone de Seguro:   ${conductorData.tiene_seguro ? "SÍ" : "NO"}

4. ESTADO
-----------------------------------------------------
Estado Inicial:      Pendiente de Revisión
Ley 21.719:          Consentimiento otorgado y firmado digitalmente
=====================================================
    `.trim();

    const summaryStream = new Readable();
    summaryStream.push(Buffer.from(resumenText, "utf-8"));
    summaryStream.push(null);

    await drive.files.create({
      requestBody: {
        name: "00_Ficha_Resumen.txt",
        parents: [driverFolderId],
      },
      media: {
        mimeType: "text/plain",
        body: summaryStream,
      },
    });

    // 3. Subir cada uno de los documentos adjuntos
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      if (doc.base64 && doc.base64.startsWith("data:")) {
        const { stream, mimeType } = dataUrlToStream(doc.base64);
        let ext = "pdf";
        if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
        else if (mimeType.includes("png")) ext = "png";

        const cleanTitle = doc.title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_");

        const fileName = `${String(i + 1).padStart(2, "0")}_${cleanTitle}.${ext}`;

        await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [driverFolderId],
          },
          media: {
            mimeType,
            body: stream,
          },
        });
      }
    }

    // 4. Subir firma digital si existe
    if (conductorData.firma_digital && conductorData.firma_digital.startsWith("data:")) {
      const { stream, mimeType } = dataUrlToStream(conductorData.firma_digital);
      await drive.files.create({
        requestBody: {
          name: "99_Firma_Digital_Conductor.png",
          parents: [driverFolderId],
        },
        media: {
          mimeType,
          body: stream,
        },
      });
    }

    console.info(`[GOOGLE DRIVE] Carpeta creada con éxito: ${folderWebViewLink}`);
    return folderWebViewLink;
  } catch (error) {
    console.error("[GOOGLE DRIVE ERROR]:", error);
    return null;
  }
}
