export interface Thema {
  id: number;
  titel: string;
  status: string;
  kategorie_id: number;
  notiz: string | null;
}

export interface Kategorie {
  id: number;
  name: string;
}