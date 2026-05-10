export interface ImdbImage {
  url: string;
  width: number;
  height: number;
}

export interface ImdbRating {
  aggregateRating: number;
  voteCount: number;
}

export interface ImdbPerson {
  id: string;
  displayName: string;
  primaryImage?: ImdbImage;
  primaryProfessions?: string[];
  alternativeNames?: string[];
}

export interface ImdbMetacritic {
  score: number;
  reviewCount: number;
}

export interface ImdbCountry {
  code: string;
  name: string;
}

export interface ImdbLanguage {
  code: string;
  name: string;
}

export interface ImdbInterest {
  id: string;
  name: string;
  isSubgenre?: boolean;
}

export interface ImdbReleaseDateInfo {
  country: ImdbCountry;
  releaseDate: {
    year: number;
    month: number;
    day: number;
  };
  attributes?: string[];
}

export interface ImdbReleaseDatesResponse {
  releaseDates: ImdbReleaseDateInfo[];
  nextPageToken: string;
}

export interface ImdbTitle {
  id: string;
  type: string;
  primaryTitle: string;
  originalTitle: string;
  primaryImage?: ImdbImage;
  startYear?: number;
  endYear?: number;
  runtimeSeconds?: number;
  genres?: string[];
  rating?: ImdbRating;
  plot?: string;
  releaseDate?: string;
  metacritic?: ImdbMetacritic;
  directors?: ImdbPerson[];
  writers?: ImdbPerson[];
  stars?: ImdbPerson[];
  originCountries?: ImdbCountry[];
  spokenLanguages?: ImdbLanguage[];
  interests?: ImdbInterest[];
  releaseDates?: ImdbReleaseDateInfo[];
}

export interface ImdbResponse {
  titles: ImdbTitle[];
  totalCount: number;
  nextPageToken: string;
}

const BASE_URL = 'https://api.imdbapi.dev';

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
