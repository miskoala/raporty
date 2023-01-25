import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRaport } from '../raport.model';

@Component({
  selector: 'jhi-raport-detail',
  templateUrl: './raport-detail.component.html',
})
export class RaportDetailComponent implements OnInit {
  raport: IRaport | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ raport }) => {
      this.raport = raport;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
