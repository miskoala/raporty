import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RaportDetailComponent } from './raport-detail.component';

describe('Raport Management Detail Component', () => {
  let comp: RaportDetailComponent;
  let fixture: ComponentFixture<RaportDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaportDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ raport: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RaportDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RaportDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load raport on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.raport).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
