import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGrupaRaportow, NewGrupaRaportow } from '../grupa-raportow.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGrupaRaportow for edit and NewGrupaRaportowFormGroupInput for create.
 */
type GrupaRaportowFormGroupInput = IGrupaRaportow | PartialWithRequiredKeyOf<NewGrupaRaportow>;

type GrupaRaportowFormDefaults = Pick<NewGrupaRaportow, 'id' | 'raporties'>;

type GrupaRaportowFormGroupContent = {
  id: FormControl<IGrupaRaportow['id'] | NewGrupaRaportow['id']>;
  nazwa: FormControl<IGrupaRaportow['nazwa']>;
  raporties: FormControl<IGrupaRaportow['raporties']>;
};

export type GrupaRaportowFormGroup = FormGroup<GrupaRaportowFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GrupaRaportowFormService {
  createGrupaRaportowFormGroup(grupaRaportow: GrupaRaportowFormGroupInput = { id: null }): GrupaRaportowFormGroup {
    const grupaRaportowRawValue = {
      ...this.getFormDefaults(),
      ...grupaRaportow,
    };
    return new FormGroup<GrupaRaportowFormGroupContent>({
      id: new FormControl(
        { value: grupaRaportowRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nazwa: new FormControl(grupaRaportowRawValue.nazwa, {
        validators: [Validators.required, Validators.minLength(10), Validators.maxLength(255)],
      }),
      raporties: new FormControl(grupaRaportowRawValue.raporties ?? []),
    });
  }

  getGrupaRaportow(form: GrupaRaportowFormGroup): IGrupaRaportow | NewGrupaRaportow {
    return form.getRawValue() as IGrupaRaportow | NewGrupaRaportow;
  }

  resetForm(form: GrupaRaportowFormGroup, grupaRaportow: GrupaRaportowFormGroupInput): void {
    const grupaRaportowRawValue = { ...this.getFormDefaults(), ...grupaRaportow };
    form.reset(
      {
        ...grupaRaportowRawValue,
        id: { value: grupaRaportowRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GrupaRaportowFormDefaults {
    return {
      id: null,
      raporties: [],
    };
  }
}
