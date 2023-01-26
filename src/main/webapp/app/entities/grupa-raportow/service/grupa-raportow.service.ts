import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrupaRaportow, NewGrupaRaportow } from '../grupa-raportow.model';

export type PartialUpdateGrupaRaportow = Partial<IGrupaRaportow> & Pick<IGrupaRaportow, 'id'>;

export type EntityResponseType = HttpResponse<IGrupaRaportow>;
export type EntityArrayResponseType = HttpResponse<IGrupaRaportow[]>;

@Injectable({ providedIn: 'root' })
export class GrupaRaportowService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grupa-raportows');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grupaRaportow: NewGrupaRaportow): Observable<EntityResponseType> {
    return this.http.post<IGrupaRaportow>(this.resourceUrl, grupaRaportow, { observe: 'response' });
  }

  update(grupaRaportow: IGrupaRaportow): Observable<EntityResponseType> {
    return this.http.put<IGrupaRaportow>(`${this.resourceUrl}/${this.getGrupaRaportowIdentifier(grupaRaportow)}`, grupaRaportow, {
      observe: 'response',
    });
  }

  partialUpdate(grupaRaportow: PartialUpdateGrupaRaportow): Observable<EntityResponseType> {
    return this.http.patch<IGrupaRaportow>(`${this.resourceUrl}/${this.getGrupaRaportowIdentifier(grupaRaportow)}`, grupaRaportow, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrupaRaportow>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrupaRaportow[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGrupaRaportowIdentifier(grupaRaportow: Pick<IGrupaRaportow, 'id'>): number {
    return grupaRaportow.id;
  }

  compareGrupaRaportow(o1: Pick<IGrupaRaportow, 'id'> | null, o2: Pick<IGrupaRaportow, 'id'> | null): boolean {
    return o1 && o2 ? this.getGrupaRaportowIdentifier(o1) === this.getGrupaRaportowIdentifier(o2) : o1 === o2;
  }

  addGrupaRaportowToCollectionIfMissing<Type extends Pick<IGrupaRaportow, 'id'>>(
    grupaRaportowCollection: Type[],
    ...grupaRaportowsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const grupaRaportows: Type[] = grupaRaportowsToCheck.filter(isPresent);
    if (grupaRaportows.length > 0) {
      const grupaRaportowCollectionIdentifiers = grupaRaportowCollection.map(
        grupaRaportowItem => this.getGrupaRaportowIdentifier(grupaRaportowItem)!
      );
      const grupaRaportowsToAdd = grupaRaportows.filter(grupaRaportowItem => {
        const grupaRaportowIdentifier = this.getGrupaRaportowIdentifier(grupaRaportowItem);
        if (grupaRaportowCollectionIdentifiers.includes(grupaRaportowIdentifier)) {
          return false;
        }
        grupaRaportowCollectionIdentifiers.push(grupaRaportowIdentifier);
        return true;
      });
      return [...grupaRaportowsToAdd, ...grupaRaportowCollection];
    }
    return grupaRaportowCollection;
  }
}
