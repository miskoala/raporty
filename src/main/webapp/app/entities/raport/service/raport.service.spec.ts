import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRaport } from '../raport.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../raport.test-samples';

import { RaportService } from './raport.service';

const requireRestSample: IRaport = {
  ...sampleWithRequiredData,
};

describe('Raport Service', () => {
  let service: RaportService;
  let httpMock: HttpTestingController;
  let expectedResult: IRaport | IRaport[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RaportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Raport', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const raport = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(raport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Raport', () => {
      const raport = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(raport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Raport', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Raport', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Raport', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRaportToCollectionIfMissing', () => {
      it('should add a Raport to an empty array', () => {
        const raport: IRaport = sampleWithRequiredData;
        expectedResult = service.addRaportToCollectionIfMissing([], raport);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(raport);
      });

      it('should not add a Raport to an array that contains it', () => {
        const raport: IRaport = sampleWithRequiredData;
        const raportCollection: IRaport[] = [
          {
            ...raport,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRaportToCollectionIfMissing(raportCollection, raport);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Raport to an array that doesn't contain it", () => {
        const raport: IRaport = sampleWithRequiredData;
        const raportCollection: IRaport[] = [sampleWithPartialData];
        expectedResult = service.addRaportToCollectionIfMissing(raportCollection, raport);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(raport);
      });

      it('should add only unique Raport to an array', () => {
        const raportArray: IRaport[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const raportCollection: IRaport[] = [sampleWithRequiredData];
        expectedResult = service.addRaportToCollectionIfMissing(raportCollection, ...raportArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const raport: IRaport = sampleWithRequiredData;
        const raport2: IRaport = sampleWithPartialData;
        expectedResult = service.addRaportToCollectionIfMissing([], raport, raport2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(raport);
        expect(expectedResult).toContain(raport2);
      });

      it('should accept null and undefined values', () => {
        const raport: IRaport = sampleWithRequiredData;
        expectedResult = service.addRaportToCollectionIfMissing([], null, raport, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(raport);
      });

      it('should return initial array if no Raport is added', () => {
        const raportCollection: IRaport[] = [sampleWithRequiredData];
        expectedResult = service.addRaportToCollectionIfMissing(raportCollection, undefined, null);
        expect(expectedResult).toEqual(raportCollection);
      });
    });

    describe('compareRaport', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRaport(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRaport(entity1, entity2);
        const compareResult2 = service.compareRaport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRaport(entity1, entity2);
        const compareResult2 = service.compareRaport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRaport(entity1, entity2);
        const compareResult2 = service.compareRaport(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
