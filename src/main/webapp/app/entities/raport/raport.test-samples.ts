import { IRaport, NewRaport } from './raport.model';

export const sampleWithRequiredData: IRaport = {
  id: 95692,
  symbol: 'Account Świętokrzysk',
  nazwa: 'Computer',
  wersja: 1907,
};

export const sampleWithPartialData: IRaport = {
  id: 50521,
  symbol: 'feed Salad Oro',
  nazwa: 'up',
  wersja: 53339,
};

export const sampleWithFullData: IRaport = {
  id: 2906,
  symbol: 'Industrial Computers',
  nazwa: 'Consultant homogeneous Glen',
  wersja: 36679,
};

export const sampleWithNewData: NewRaport = {
  symbol: 'Mazowieckie relation',
  nazwa: 'Pizza',
  wersja: 52301,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
