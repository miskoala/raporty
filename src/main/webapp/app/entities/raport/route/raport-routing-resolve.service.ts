import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRaport } from '../raport.model';
import { RaportService } from '../service/raport.service';

@Injectable({ providedIn: 'root' })
export class RaportRoutingResolveService implements Resolve<IRaport | null> {
  constructor(protected service: RaportService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRaport | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((raport: HttpResponse<IRaport>) => {
          if (raport.body) {
            return of(raport.body);
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
