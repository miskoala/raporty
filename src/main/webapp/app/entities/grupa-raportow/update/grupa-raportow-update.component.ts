import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GrupaRaportowFormService, GrupaRaportowFormGroup } from './grupa-raportow-form.service';
import { IGrupaRaportow } from '../grupa-raportow.model';
import { GrupaRaportowService } from '../service/grupa-raportow.service';

@Component({
  selector: 'jhi-grupa-raportow-update',
  templateUrl: './grupa-raportow-update.component.html',
})
export class GrupaRaportowUpdateComponent implements OnInit {
  isSaving = false;
  grupaRaportow: IGrupaRaportow | null = null;

  editForm: GrupaRaportowFormGroup = this.grupaRaportowFormService.createGrupaRaportowFormGroup();

  constructor(
    protected grupaRaportowService: GrupaRaportowService,
    protected grupaRaportowFormService: GrupaRaportowFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grupaRaportow }) => {
      this.grupaRaportow = grupaRaportow;
      if (grupaRaportow) {
        this.updateForm(grupaRaportow);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grupaRaportow = this.grupaRaportowFormService.getGrupaRaportow(this.editForm);
    if (grupaRaportow.id !== null) {
      this.subscribeToSaveResponse(this.grupaRaportowService.update(grupaRaportow));
    } else {
      this.subscribeToSaveResponse(this.grupaRaportowService.create(grupaRaportow));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrupaRaportow>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(grupaRaportow: IGrupaRaportow): void {
    this.grupaRaportow = grupaRaportow;
    this.grupaRaportowFormService.resetForm(this.editForm, grupaRaportow);
  }
}
