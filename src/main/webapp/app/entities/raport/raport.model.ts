export interface IRaport {
  id: number;
  symbol?: string | null;
  nazwa?: string | null;
  wersja?: number | null;
}

export type NewRaport = Omit<IRaport, 'id'> & { id: null };
