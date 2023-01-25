import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRaport, NewRaport } from '../raport.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRaport for edit and NewRaportFormGroupInput for create.
 */
type RaportFormGroupInput = IRaport | PartialWithRequiredKeyOf<NewRaport>;

type RaportFormDefaults = Pick<NewRaport, 'id'>;

type RaportFormGroupContent = {
  id: FormControl<IRaport['id'] | NewRaport['id']>;
  symbol: FormControl<IRaport['symbol']>;
  nazwa: FormControl<IRaport['nazwa']>;
  wersja: FormControl<IRaport['wersja']>;
};

export type RaportFormGroup = FormGroup<RaportFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RaportFormService {
  createRaportFormGroup(raport: RaportFormGroupInput = { id: null }): RaportFormGroup {
    const raportRawValue = {
      ...this.getFormDefaults(),
      ...raport,
    };
    return new FormGroup<RaportFormGroupContent>({
      id: new FormControl(
        { value: raportRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      symbol: new FormControl(raportRawValue.symbol, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      }),
      nazwa: new FormControl(raportRawValue.nazwa, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
      }),
      wersja: new FormControl(raportRawValue.wersja, {
        validators: [Validators.required],
      }),
    });
  }

  getRaport(form: RaportFormGroup): IRaport | NewRaport {
    return form.getRawValue() as IRaport | NewRaport;
  }

  resetForm(form: RaportFormGroup, raport: RaportFormGroupInput): void {
    const raportRawValue = { ...this.getFormDefaults(), ...raport };
    form.reset(
      {
        ...raportRawValue,
        id: { value: raportRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RaportFormDefaults {
    return {
      id: null,
    };
  }
}
