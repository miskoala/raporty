import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RaportFormService, RaportFormGroup } from './raport-form.service';
import { IRaport } from '../raport.model';
import { RaportService } from '../service/raport.service';
import { IGrupaRaportow } from 'app/entities/grupa-raportow/grupa-raportow.model';
import { GrupaRaportowService } from 'app/entities/grupa-raportow/service/grupa-raportow.service';

@Component({
  selector: 'jhi-raport-update',
  templateUrl: './raport-update.component.html',
})
export class RaportUpdateComponent implements OnInit {
  isSaving = false;
  raport: IRaport | null = null;

  grupaRaportowsSharedCollection: IGrupaRaportow[] = [];

  editForm: RaportFormGroup = this.raportFormService.createRaportFormGroup();

  constructor(
    protected raportService: RaportService,
    protected raportFormService: RaportFormService,
    protected grupaRaportowService: GrupaRaportowService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGrupaRaportow = (o1: IGrupaRaportow | null, o2: IGrupaRaportow | null): boolean =>
    this.grupaRaportowService.compareGrupaRaportow(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ raport }) => {
      this.raport = raport;
      if (raport) {
        this.updateForm(raport);
      }

      this.loadRelationshipsOptions();
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

    this.grupaRaportowsSharedCollection = this.grupaRaportowService.addGrupaRaportowToCollectionIfMissing<IGrupaRaportow>(
      this.grupaRaportowsSharedCollection,
      ...(raport.grupaRaportows ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.grupaRaportowService
      .query()
      .pipe(map((res: HttpResponse<IGrupaRaportow[]>) => res.body ?? []))
      .pipe(
        map((grupaRaportows: IGrupaRaportow[]) =>
          this.grupaRaportowService.addGrupaRaportowToCollectionIfMissing<IGrupaRaportow>(
            grupaRaportows,
            ...(this.raport?.grupaRaportows ?? [])
          )
        )
      )
      .subscribe((grupaRaportows: IGrupaRaportow[]) => (this.grupaRaportowsSharedCollection = grupaRaportows));
  }
}
