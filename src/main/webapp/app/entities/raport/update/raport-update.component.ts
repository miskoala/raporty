import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RaportFormService, RaportFormGroup } from './raport-form.service';
import { IRaport } from '../raport.model';
import { RaportService } from '../service/raport.service';

@Component({
  selector: 'jhi-raport-update',
  templateUrl: './raport-update.component.html',
})
export class RaportUpdateComponent implements OnInit {
  isSaving = false;
  raport: IRaport | null = null;

  editForm: RaportFormGroup = this.raportFormService.createRaportFormGroup();

  constructor(
    protected raportService: RaportService,
    protected raportFormService: RaportFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ raport }) => {
      this.raport = raport;
      if (raport) {
        this.updateForm(raport);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const raport = this.raportFormService.getRaport(this.editForm);
    if (raport.id !== null) {
      this.subscribeToSaveResponse(this.raportService.update(raport));
    } else {
      this.subscribeToSaveResponse(this.raportService.create(raport));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRaport>>): void {
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

  protected updateForm(raport: IRaport): void {
    this.raport = raport;
    this.raportFormService.resetForm(this.editForm, raport);
  }
}
