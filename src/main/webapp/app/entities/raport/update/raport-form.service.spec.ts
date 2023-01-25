import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../raport.test-samples';

import { RaportFormService } from './raport-form.service';

describe('Raport Form Service', () => {
  let service: RaportFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaportFormService);
  });

  describe('Service methods', () => {
    describe('createRaportFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRaportFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            symbol: expect.any(Object),
            nazwa: expect.any(Object),
            wersja: expect.any(Object),
          })
        );
      });

      it('passing IRaport should create a new form with FormGroup', () => {
        const formGroup = service.createRaportFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            symbol: expect.any(Object),
            nazwa: expect.any(Object),
            wersja: expect.any(Object),
          })
        );
      });
    });

    describe('getRaport', () => {
      it('should return NewRaport for default Raport initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRaportFormGroup(sampleWithNewData);

        const raport = service.getRaport(formGroup) as any;

        expect(raport).toMatchObject(sampleWithNewData);
      });

      it('should return NewRaport for empty Raport initial value', () => {
        const formGroup = service.createRaportFormGroup();

        const raport = service.getRaport(formGroup) as any;

        expect(raport).toMatchObject({});
      });

      it('should return IRaport', () => {
        const formGroup = service.createRaportFormGroup(sampleWithRequiredData);

        const raport = service.getRaport(formGroup) as any;

        expect(raport).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRaport should not enable id FormControl', () => {
        const formGroup = service.createRaportFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRaport should disable id FormControl', () => {
        const formGroup = service.createRaportFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
