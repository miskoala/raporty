import { IRaport, NewRaport } from './raport.model';

export const sampleWithRequiredData: IRaport = {
  id: 95692,
  symbol: 'Account Świętokrzysk',
  nazwa: 'Computer',
  wersja: 1908,
};

export const sampleWithPartialData: IRaport = {
  id: 50521,
  symbol: 'feed Salad Oro',
  nazwa: 'up',
  wersja: 53340,
};

export const sampleWithFullData: IRaport = {
  id: 2906,
  symbol: 'Industrial Computers',
  nazwa: 'Consultant homogeneous Glen',
  wersja: 36680,
};

export const sampleWithNewData: NewRaport = {
  symbol: 'Mazowieckie relation',
  nazwa: 'Pizza',
  wersja: 52302,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
