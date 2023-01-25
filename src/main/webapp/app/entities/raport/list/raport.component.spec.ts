import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RaportService } from '../service/raport.service';

import { RaportComponent } from './raport.component';

describe('Raport Management Component', () => {
  let comp: RaportComponent;
  let fixture: ComponentFixture<RaportComponent>;
  let service: RaportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'raport', component: RaportComponent }]), HttpClientTestingModule],
      declarations: [RaportComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(RaportComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RaportComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RaportService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.raports?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to raportService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRaportIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRaportIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
