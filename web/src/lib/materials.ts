import { getPublicMaterials } from '@/services/materialService';

export interface Material {
  material_id: number;
  material_name: string;
  unitprice: number;
}

// Server-side data fetching function
export async function getMaterialsData(): Promise<Material[]> {
  try {
    const response = await getPublicMaterials();
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    return [];
  }
}

