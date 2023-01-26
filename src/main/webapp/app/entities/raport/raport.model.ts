import { IGrupaRaportow } from 'app/entities/grupa-raportow/grupa-raportow.model';

export interface IRaport {
  id: number;
  symbol?: string | null;
  nazwa?: string | null;
  wersja?: number | null;
  grupaRaportows?: Pick<IGrupaRaportow, 'id'>[] | null;
}

export type NewRaport = Omit<IRaport, 'id'> & { id: null };
