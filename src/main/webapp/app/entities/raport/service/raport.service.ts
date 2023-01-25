import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRaport, NewRaport } from '../raport.model';

export type PartialUpdateRaport = Partial<IRaport> & Pick<IRaport, 'id'>;

export type EntityResponseType = HttpResponse<IRaport>;
export type EntityArrayResponseType = HttpResponse<IRaport[]>;

@Injectable({ providedIn: 'root' })
export class RaportService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/raports');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(raport: NewRaport): Observable<EntityResponseType> {
    return this.http.post<IRaport>(this.resourceUrl, raport, { observe: 'response' });
  }

  update(raport: IRaport): Observable<EntityResponseType> {
    return this.http.put<IRaport>(`${this.resourceUrl}/${this.getRaportIdentifier(raport)}`, raport, { observe: 'response' });
  }

  partialUpdate(raport: PartialUpdateRaport): Observable<EntityResponseType> {
    return this.http.patch<IRaport>(`${this.resourceUrl}/${this.getRaportIdentifier(raport)}`, raport, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRaport>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRaport[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRaportIdentifier(raport: Pick<IRaport, 'id'>): number {
    return raport.id;
  }

  compareRaport(o1: Pick<IRaport, 'id'> | null, o2: Pick<IRaport, 'id'> | null): boolean {
    return o1 && o2 ? this.getRaportIdentifier(o1) === this.getRaportIdentifier(o2) : o1 === o2;
  }

  addRaportToCollectionIfMissing<Type extends Pick<IRaport, 'id'>>(
    raportCollection: Type[],
    ...raportsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const raports: Type[] = raportsToCheck.filter(isPresent);
    if (raports.length > 0) {
      const raportCollectionIdentifiers = raportCollection.map(raportItem => this.getRaportIdentifier(raportItem)!);
      const raportsToAdd = raports.filter(raportItem => {
        const raportIdentifier = this.getRaportIdentifier(raportItem);
        if (raportCollectionIdentifiers.includes(raportIdentifier)) {
          return false;
        }
        raportCollectionIdentifiers.push(raportIdentifier);
        return true;
      });
      return [...raportsToAdd, ...raportCollection];
    }
    return raportCollection;
  }
}
