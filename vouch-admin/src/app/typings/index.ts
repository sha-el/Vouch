export interface Location {
  line: number;
  column: number;
}

export interface Extensions {
  reason: string;
  code: number;
}

export interface GQLError {
  message: string;
  locations: Location[];
  path: string[];
  extensions: Extensions;
}
