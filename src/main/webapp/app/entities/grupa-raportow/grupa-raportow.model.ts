import { IRaport } from 'app/entities/raport/raport.model';

export interface IGrupaRaportow {
  id: number;
  nazwa?: string | null;
  raporties?: Pick<IRaport, 'id'>[] | null;
}

export type NewGrupaRaportow = Omit<IGrupaRaportow, 'id'> & { id: null };
