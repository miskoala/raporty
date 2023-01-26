import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrupaRaportow } from '../grupa-raportow.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../grupa-raportow.test-samples';

import { GrupaRaportowService } from './grupa-raportow.service';

const requireRestSample: IGrupaRaportow = {
  ...sampleWithRequiredData,
};

describe('GrupaRaportow Service', () => {
  let service: GrupaRaportowService;
  let httpMock: HttpTestingController;
  let expectedResult: IGrupaRaportow | IGrupaRaportow[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrupaRaportowService);
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

    it('should create a GrupaRaportow', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const grupaRaportow = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(grupaRaportow).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GrupaRaportow', () => {
      const grupaRaportow = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(grupaRaportow).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GrupaRaportow', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GrupaRaportow', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GrupaRaportow', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGrupaRaportowToCollectionIfMissing', () => {
      it('should add a GrupaRaportow to an empty array', () => {
        const grupaRaportow: IGrupaRaportow = sampleWithRequiredData;
        expectedResult = service.addGrupaRaportowToCollectionIfMissing([], grupaRaportow);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grupaRaportow);
      });

      it('should not add a GrupaRaportow to an array that contains it', () => {
        const grupaRaportow: IGrupaRaportow = sampleWithRequiredData;
        const grupaRaportowCollection: IGrupaRaportow[] = [
          {
            ...grupaRaportow,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGrupaRaportowToCollectionIfMissing(grupaRaportowCollection, grupaRaportow);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GrupaRaportow to an array that doesn't contain it", () => {
        const grupaRaportow: IGrupaRaportow = sampleWithRequiredData;
        const grupaRaportowCollection: IGrupaRaportow[] = [sampleWithPartialData];
        expectedResult = service.addGrupaRaportowToCollectionIfMissing(grupaRaportowCollection, grupaRaportow);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grupaRaportow);
      });

      it('should add only unique GrupaRaportow to an array', () => {
        const grupaRaportowArray: IGrupaRaportow[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const grupaRaportowCollection: IGrupaRaportow[] = [sampleWithRequiredData];
        expectedResult = service.addGrupaRaportowToCollectionIfMissing(grupaRaportowCollection, ...grupaRaportowArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grupaRaportow: IGrupaRaportow = sampleWithRequiredData;
        const grupaRaportow2: IGrupaRaportow = sampleWithPartialData;
        expectedResult = service.addGrupaRaportowToCollectionIfMissing([], grupaRaportow, grupaRaportow2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grupaRaportow);
        expect(expectedResult).toContain(grupaRaportow2);
      });

      it('should accept null and undefined values', () => {
        const grupaRaportow: IGrupaRaportow = sampleWithRequiredData;
        expectedResult = service.addGrupaRaportowToCollectionIfMissing([], null, grupaRaportow, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grupaRaportow);
      });

      it('should return initial array if no GrupaRaportow is added', () => {
        const grupaRaportowCollection: IGrupaRaportow[] = [sampleWithRequiredData];
        expectedResult = service.addGrupaRaportowToCollectionIfMissing(grupaRaportowCollection, undefined, null);
        expect(expectedResult).toEqual(grupaRaportowCollection);
      });
    });

    describe('compareGrupaRaportow', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGrupaRaportow(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGrupaRaportow(entity1, entity2);
        const compareResult2 = service.compareGrupaRaportow(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGrupaRaportow(entity1, entity2);
        const compareResult2 = service.compareGrupaRaportow(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGrupaRaportow(entity1, entity2);
        const compareResult2 = service.compareGrupaRaportow(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
