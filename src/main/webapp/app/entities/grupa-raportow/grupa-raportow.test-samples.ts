import { IGrupaRaportow, NewGrupaRaportow } from './grupa-raportow.model';

export const sampleWithRequiredData: IGrupaRaportow = {
  id: 41030,
  nazwa: 'MarksXXXXX',
};

export const sampleWithPartialData: IGrupaRaportow = {
  id: 55915,
  nazwa: 'CheeseXXXX',
};

export const sampleWithFullData: IGrupaRaportow = {
  id: 4825,
  nazwa: 'CottonXXXX',
};

export const sampleWithNewData: NewGrupaRaportow = {
  nazwa: 'homogeneous',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
