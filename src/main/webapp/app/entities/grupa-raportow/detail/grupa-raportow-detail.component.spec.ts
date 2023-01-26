import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrupaRaportowDetailComponent } from './grupa-raportow-detail.component';

describe('GrupaRaportow Management Detail Component', () => {
  let comp: GrupaRaportowDetailComponent;
  let fixture: ComponentFixture<GrupaRaportowDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrupaRaportowDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grupaRaportow: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrupaRaportowDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrupaRaportowDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grupaRaportow on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grupaRaportow).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
