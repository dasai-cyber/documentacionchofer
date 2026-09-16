// Almacén en memoria para desarrollo/fallback local cuando Supabase no está configurado
export let mockConductoresDb: any[] = [];

export function getMockConductores() {
  return mockConductoresDb;
}

export function addMockConductor(conductor: any) {
  mockConductoresDb.unshift(conductor);
}

export function findMockConductor(id: string) {
  return mockConductoresDb.find((c) => c.id === id);
}

export function updateMockConductor(id: string, updates: any) {
  const index = mockConductoresDb.findIndex((c) => c.id === id);
  if (index !== -1) {
    mockConductoresDb[index] = {
      ...mockConductoresDb[index],
      ...updates,
    };
    return mockConductoresDb[index];
  }
  return null;
}
