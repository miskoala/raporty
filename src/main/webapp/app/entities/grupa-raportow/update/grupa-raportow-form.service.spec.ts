import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../grupa-raportow.test-samples';

import { GrupaRaportowFormService } from './grupa-raportow-form.service';

describe('GrupaRaportow Form Service', () => {
  let service: GrupaRaportowFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupaRaportowFormService);
  });

  describe('Service methods', () => {
    describe('createGrupaRaportowFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGrupaRaportowFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nazwa: expect.any(Object),
            raporties: expect.any(Object),
          })
        );
      });

      it('passing IGrupaRaportow should create a new form with FormGroup', () => {
        const formGroup = service.createGrupaRaportowFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nazwa: expect.any(Object),
            raporties: expect.any(Object),
          })
        );
      });
    });

    describe('getGrupaRaportow', () => {
      it('should return NewGrupaRaportow for default GrupaRaportow initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGrupaRaportowFormGroup(sampleWithNewData);

        const grupaRaportow = service.getGrupaRaportow(formGroup) as any;

        expect(grupaRaportow).toMatchObject(sampleWithNewData);
      });

      it('should return NewGrupaRaportow for empty GrupaRaportow initial value', () => {
        const formGroup = service.createGrupaRaportowFormGroup();

        const grupaRaportow = service.getGrupaRaportow(formGroup) as any;

        expect(grupaRaportow).toMatchObject({});
      });

      it('should return IGrupaRaportow', () => {
        const formGroup = service.createGrupaRaportowFormGroup(sampleWithRequiredData);

        const grupaRaportow = service.getGrupaRaportow(formGroup) as any;

        expect(grupaRaportow).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGrupaRaportow should not enable id FormControl', () => {
        const formGroup = service.createGrupaRaportowFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGrupaRaportow should disable id FormControl', () => {
        const formGroup = service.createGrupaRaportowFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
