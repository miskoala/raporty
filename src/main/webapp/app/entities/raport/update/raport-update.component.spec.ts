import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RaportFormService } from './raport-form.service';
import { RaportService } from '../service/raport.service';
import { IRaport } from '../raport.model';
import { IGrupaRaportow } from 'app/entities/grupa-raportow/grupa-raportow.model';
import { GrupaRaportowService } from 'app/entities/grupa-raportow/service/grupa-raportow.service';

import { RaportUpdateComponent } from './raport-update.component';

describe('Raport Management Update Component', () => {
  let comp: RaportUpdateComponent;
  let fixture: ComponentFixture<RaportUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let raportFormService: RaportFormService;
  let raportService: RaportService;
  let grupaRaportowService: GrupaRaportowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RaportUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RaportUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RaportUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    raportFormService = TestBed.inject(RaportFormService);
    raportService = TestBed.inject(RaportService);
    grupaRaportowService = TestBed.inject(GrupaRaportowService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call GrupaRaportow query and add missing value', () => {
      const raport: IRaport = { id: 456 };
      const grupaRaportows: IGrupaRaportow[] = [{ id: 71061 }];
      raport.grupaRaportows = grupaRaportows;

      const grupaRaportowCollection: IGrupaRaportow[] = [{ id: 79932 }];
      jest.spyOn(grupaRaportowService, 'query').mockReturnValue(of(new HttpResponse({ body: grupaRaportowCollection })));
      const additionalGrupaRaportows = [...grupaRaportows];
      const expectedCollection: IGrupaRaportow[] = [...additionalGrupaRaportows, ...grupaRaportowCollection];
      jest.spyOn(grupaRaportowService, 'addGrupaRaportowToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ raport });
      comp.ngOnInit();

      expect(grupaRaportowService.query).toHaveBeenCalled();
      expect(grupaRaportowService.addGrupaRaportowToCollectionIfMissing).toHaveBeenCalledWith(
        grupaRaportowCollection,
        ...additionalGrupaRaportows.map(expect.objectContaining)
      );
      expect(comp.grupaRaportowsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const raport: IRaport = { id: 456 };
      const grupaRaportow: IGrupaRaportow = { id: 64078 };
      raport.grupaRaportows = [grupaRaportow];

      activatedRoute.data = of({ raport });
      comp.ngOnInit();

      expect(comp.grupaRaportowsSharedCollection).toContain(grupaRaportow);
      expect(comp.raport).toEqual(raport);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRaport>>();
      const raport = { id: 123 };
      jest.spyOn(raportFormService, 'getRaport').mockReturnValue(raport);
      jest.spyOn(raportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ raport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: raport }));
      saveSubject.complete();

      // THEN
      expect(raportFormService.getRaport).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(raportService.update).toHaveBeenCalledWith(expect.objectContaining(raport));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRaport>>();
      const raport = { id: 123 };
      jest.spyOn(raportFormService, 'getRaport').mockReturnValue({ id: null });
      jest.spyOn(raportService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ raport: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: raport }));
      saveSubject.complete();

      // THEN
      expect(raportFormService.getRaport).toHaveBeenCalled();
      expect(raportService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRaport>>();
      const raport = { id: 123 };
      jest.spyOn(raportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ raport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(raportService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGrupaRaportow', () => {
      it('Should forward to grupaRaportowService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(grupaRaportowService, 'compareGrupaRaportow');
        comp.compareGrupaRaportow(entity, entity2);
        expect(grupaRaportowService.compareGrupaRaportow).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
