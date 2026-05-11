import type { ImdbTitle, ImdbResponse, ImdbReleaseDateInfo, ImdbReleaseDatesResponse } from '../types/imdbTypes';

const BASE_URL = 'https://api.imdbapi.dev';

// Obtiene todos los títulos
export async function getTitles(): Promise<ImdbTitle[]> {
  try {
    const response = await fetch(`${BASE_URL}/titles`);
    if (!response.ok) {
      throw new Error(`Error fetching titles: ${response.statusText}`);
    }
    const data: ImdbResponse = await response.json();
    return data.titles || [];
  } catch (error) {
    console.error("Failed to fetch IMDB titles:", error);
    return [];
  }
}

// Obtiene un título por ID
export async function getTitleById(id: string): Promise<ImdbTitle | null> {
  try {
    const response = await fetch(`${BASE_URL}/titles/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching title ${id}: ${response.statusText}`);
    }
    const data: ImdbTitle = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch IMDB title ${id}:`, error);
    return null;
  }
}

// Obtiene las fechas de lanzamiento de un título
export async function getReleaseDates(id: string): Promise<ImdbReleaseDateInfo[]> {
  try {
    const response = await fetch(`${BASE_URL}/titles/${id}/releaseDates`);
    if (!response.ok) {
      throw new Error(`Error fetching release dates for ${id}: ${response.statusText}`);
    }
    const data: ImdbReleaseDatesResponse = await response.json();
    return data.releaseDates || [];
  } catch (error) {
    console.error(`Failed to fetch release dates for ${id}:`, error);
    return [];
  }
}

// Busca títulos por consulta
export async function searchTitles(query: string, limit: number = 5): Promise<ImdbTitle[]> {
  try {
    const response = await fetch(`${BASE_URL}/search/titles?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error searching titles for ${query}: ${response.statusText}`);
    }
    const data: ImdbResponse = await response.json();
    return data.titles || [];
  } catch (error) {
    console.error(`Failed to search titles for ${query}:`, error);
    return [];
  }
}

// Obtiene títulos por país
export async function getTitlesByCountry(countryName: string, limit: number = 20): Promise<ImdbTitle[]> {
  try {
    // Usamos el buscador porque el parámetro originCountry de esta API parece no estar filtrando correctamente
    const response = await fetch(`${BASE_URL}/search/titles?query=${encodeURIComponent(countryName)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error searching titles for country ${countryName}: ${response.statusText}`);
    }
    const data: ImdbResponse = await response.json();
    return data.titles || [];
  } catch (error) {
    console.error(`Failed to fetch titles for country ${countryName}:`, error);
    return [];
  }
}
