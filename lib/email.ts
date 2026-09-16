import { Resend } from "resend";
import nodemailer from "nodemailer";

const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL || "contacto@dasai.cl";
const fromEmail = process.env.EMAIL_FROM || "Dasai Logística <onboarding@resend.dev>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Configuración SMTP opcional (ej: Gmail con Contraseña de Aplicación)
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const smtpTransporter =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

interface EmailPayload {
  conductorData: any;
  documents: { title: string; url: string; base64?: string; filename?: string }[];
  id: string;
}

/**
 * Genera el template HTML del correo para el administrador de Dasai
 */
function generateAdminEmailHtml(payload: EmailPayload): string {
  const { conductorData, documents, id } = payload;

  const docRows = documents
    .map(
      (doc) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-weight: 600; color: #1e293b; font-size: 13px;">${doc.title}</td>
        <td style="padding: 10px 14px; text-align: right;">
          <a href="${doc.url}" target="_blank" style="background-color: #0284c7; color: #ffffff; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold; display: inline-block;">
            Ver Documento ↗
          </a>
        </td>
      </tr>
    `
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Nueva Ficha de Conductor - Dasai</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;">
    <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
      
      <!-- Header -->
      <div style="background-color: #0f172a; padding: 24px 32px; color: #ffffff; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">DASAI LOGÍSTICA</h1>
          <span style="background-color: #0284c7; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">Nueva Postulación</span>
        </div>
        <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Ficha de Registro de Conductor / Transportista</p>
      </div>

      <div style="padding: 32px;">
        
        <!-- Alerta de recepción -->
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0; color: #166534; font-size: 14px; font-weight: bold;">
            ✓ Se ha recibido una nueva solicitud de registro de conductor.
          </p>
          <p style="margin: 4px 0 0 0; color: #15803d; font-size: 12px;">Folio Único: <strong>${id}</strong></p>
        </div>

        <!-- Sección 1: Datos Personales -->
        <h2 style="font-size: 15px; text-transform: uppercase; color: #0284c7; margin: 0 0 12px 0; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
          1. Datos del Conductor
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 40%;">Nombre Completo:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${conductorData.nombre_completo}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">RUT:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${conductorData.rut}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Correo Electrónico:</td>
            <td style="padding: 6px 0; color: #0284c7;"><a href="mailto:${conductorData.email}" style="color: #0284c7; text-decoration: none;">${conductorData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Teléfono Principal:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${conductorData.telefono_principal}</td>
          </tr>
          ${
            conductorData.telefono_secundario
              ? `<tr><td style="padding: 6px 0; color: #64748b;">Teléfono Secundario:</td><td style="padding: 6px 0; color: #0f172a;">${conductorData.telefono_secundario}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Dirección / Comuna:</td>
            <td style="padding: 6px 0; color: #0f172a;">${conductorData.direccion}, ${conductorData.comuna}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Estado Civil / Estudios:</td>
            <td style="padding: 6px 0; color: #0f172a;">${conductorData.estado_civil} • ${conductorData.estudios_alcanzados}</td>
          </tr>
        </table>

        <!-- Sección 2: Datos Bancarios -->
        <h2 style="font-size: 15px; text-transform: uppercase; color: #0284c7; margin: 0 0 12px 0; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
          2. Datos Bancarios para Transferencias
        </h2>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 10px; margin-bottom: 24px; font-size: 13px;">
          <p style="margin: 0 0 6px 0;"><strong>Banco:</strong> ${conductorData.banco}</p>
          <p style="margin: 0 0 6px 0;"><strong>Tipo de Cuenta:</strong> ${conductorData.tipo_cuenta}</p>
          <p style="margin: 0;"><strong>Número de Cuenta:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #0f172a;">${conductorData.numero_cuenta}</span></p>
        </div>

        <!-- Sección 3: Vehículo y Empresa -->
        <h2 style="font-size: 15px; text-transform: uppercase; color: #0284c7; margin: 0 0 12px 0; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
          3. Modalidad y Equipamiento
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Modalidad Tributaria:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">
              ${conductorData.registra_empresa ? "🏢 Empresa Registrada (Emite Factura)" : "👤 Persona Natural (Comodato Notarial)"}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">¿Cuenta con GPS?:</td>
            <td style="padding: 6px 0; font-weight: bold;">${conductorData.tiene_gps ? "✓ Sí dispone" : "✗ No dispone"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">¿Cuenta con Seguro de Carga?:</td>
            <td style="padding: 6px 0; font-weight: bold;">${conductorData.tiene_seguro ? "✓ Sí dispone" : "✗ No dispone"}</td>
          </tr>
        </table>

        <!-- Sección 4: Documentos Adjuntos -->
        <h2 style="font-size: 15px; text-transform: uppercase; color: #0284c7; margin: 0 0 12px 0; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
          4. Documentos Adjuntos (${documents.length})
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
          <tbody>
            ${docRows}
          </tbody>
        </table>

        <!-- Firma Digital -->
        ${
          conductorData.firma_digital
            ? `
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase;">Firma Digital del Conductor (Ley 21.719)</p>
            <img src="${conductorData.firma_digital}" alt="Firma Conductor" style="max-height: 90px; max-width: 100%;" />
          </div>
        `
            : ""
        }

      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center; font-size: 11px; color: #94a3b8;">
        Este correo fue generado automáticamente por el sistema de enrolamiento de Dasai SpA conforme a la Ley 21.719 de protección de datos personales.
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Envia el correo de notificación con toda la información y adjuntos
 */
export async function sendConductorNotificationEmail(payload: EmailPayload) {
  const { conductorData, documents, id } = payload;
  const subject = `🚛 Nueva Ficha Conductor: ${conductorData.nombre_completo} (${conductorData.rut})`;
  const html = generateAdminEmailHtml(payload);

  // Preparar adjuntos para el correo si tienen base64
  const attachments = documents
    .filter((d) => d.base64 && d.base64.startsWith("data:"))
    .map((d) => {
      const [header, content] = d.base64!.split(",");
      return {
        filename: `${d.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.${header.includes("pdf") ? "pdf" : "png"}`,
        content: Buffer.from(content, "base64"),
      };
    });

  // 1. Intentar con Resend
  if (resend) {
    try {
      const resendAttachments = attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      }));

      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject,
        html,
        attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
      });

      console.info(`[EMAIL] Notificación enviada con Resend a ${adminEmail}`);

      // Enviar copia de confirmación al conductor
      if (conductorData.email) {
        await resend.emails.send({
          from: fromEmail,
          to: conductorData.email,
          subject: "Comprobante de Registro de Conductor — Dasai Logística",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
              <h2>¡Hola, ${conductorData.nombre_completo}!</h2>
              <p>Hemos recibido satisfactoriamente tu ficha de registro y documentos para Dasai.</p>
              <p>Tu Folio de Registro es: <strong>${id}</strong></p>
              <p>Nuestro equipo de operaciones revisará tus antecedentes y se pondrá en contacto contigo a la brevedad.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #64748b;">Dasai Logística SpA — Enrolamiento de Transportistas</p>
            </div>
          `,
        });
      }

      return { success: true, provider: "resend" };
    } catch (err) {
      console.error("[EMAIL ERROR RESEND]:", err);
    }
  }

  // 2. Intentar con SMTP (Gmail/Outlook/etc.)
  if (smtpTransporter) {
    try {
      await smtpTransporter.sendMail({
        from: `"${fromEmail.replace(/<.*>/, "")}" <${smtpUser}>`,
        to: adminEmail,
        subject,
        html,
        attachments,
      });

      console.info(`[EMAIL] Notificación enviada por SMTP a ${adminEmail}`);
      return { success: true, provider: "smtp" };
    } catch (err) {
      console.error("[EMAIL ERROR SMTP]:", err);
    }
  }

  console.info(
    `[EMAIL SIMULATION] Correo listo para ${adminEmail}. Para recibirlo en tu bandeja, configura RESEND_API_KEY o SMTP en .env.local / Vercel.`
  );

  return { success: true, provider: "mock" };
}
