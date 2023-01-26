import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrupaRaportowFormService } from './grupa-raportow-form.service';
import { GrupaRaportowService } from '../service/grupa-raportow.service';
import { IGrupaRaportow } from '../grupa-raportow.model';

import { GrupaRaportowUpdateComponent } from './grupa-raportow-update.component';

describe('GrupaRaportow Management Update Component', () => {
  let comp: GrupaRaportowUpdateComponent;
  let fixture: ComponentFixture<GrupaRaportowUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grupaRaportowFormService: GrupaRaportowFormService;
  let grupaRaportowService: GrupaRaportowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrupaRaportowUpdateComponent],
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
      .overrideTemplate(GrupaRaportowUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrupaRaportowUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grupaRaportowFormService = TestBed.inject(GrupaRaportowFormService);
    grupaRaportowService = TestBed.inject(GrupaRaportowService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grupaRaportow: IGrupaRaportow = { id: 456 };

      activatedRoute.data = of({ grupaRaportow });
      comp.ngOnInit();

      expect(comp.grupaRaportow).toEqual(grupaRaportow);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrupaRaportow>>();
      const grupaRaportow = { id: 123 };
      jest.spyOn(grupaRaportowFormService, 'getGrupaRaportow').mockReturnValue(grupaRaportow);
      jest.spyOn(grupaRaportowService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grupaRaportow });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grupaRaportow }));
      saveSubject.complete();

      // THEN
      expect(grupaRaportowFormService.getGrupaRaportow).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(grupaRaportowService.update).toHaveBeenCalledWith(expect.objectContaining(grupaRaportow));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrupaRaportow>>();
      const grupaRaportow = { id: 123 };
      jest.spyOn(grupaRaportowFormService, 'getGrupaRaportow').mockReturnValue({ id: null });
      jest.spyOn(grupaRaportowService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grupaRaportow: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grupaRaportow }));
      saveSubject.complete();

      // THEN
      expect(grupaRaportowFormService.getGrupaRaportow).toHaveBeenCalled();
      expect(grupaRaportowService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrupaRaportow>>();
      const grupaRaportow = { id: 123 };
      jest.spyOn(grupaRaportowService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grupaRaportow });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grupaRaportowService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
