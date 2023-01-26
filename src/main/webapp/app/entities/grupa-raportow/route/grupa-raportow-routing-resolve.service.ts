import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrupaRaportow } from '../grupa-raportow.model';
import { GrupaRaportowService } from '../service/grupa-raportow.service';

@Injectable({ providedIn: 'root' })
export class GrupaRaportowRoutingResolveService implements Resolve<IGrupaRaportow | null> {
  constructor(protected service: GrupaRaportowService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrupaRaportow | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grupaRaportow: HttpResponse<IGrupaRaportow>) => {
          if (grupaRaportow.body) {
            return of(grupaRaportow.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
