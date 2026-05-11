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