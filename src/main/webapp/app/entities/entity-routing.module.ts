import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'raport',
        data: { pageTitle: 'raportyApp.raport.home.title' },
        loadChildren: () => import('./raport/raport.module').then(m => m.RaportModule),
      },
      {
        path: 'grupa-raportow',
        data: { pageTitle: 'raportyApp.grupaRaportow.home.title' },
        loadChildren: () => import('./grupa-raportow/grupa-raportow.module').then(m => m.GrupaRaportowModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
