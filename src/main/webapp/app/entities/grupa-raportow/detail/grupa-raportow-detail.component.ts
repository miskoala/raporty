import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrupaRaportow } from '../grupa-raportow.model';

@Component({
  selector: 'jhi-grupa-raportow-detail',
  templateUrl: './grupa-raportow-detail.component.html',
})
export class GrupaRaportowDetailComponent implements OnInit {
  grupaRaportow: IGrupaRaportow | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grupaRaportow }) => {
      this.grupaRaportow = grupaRaportow;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
