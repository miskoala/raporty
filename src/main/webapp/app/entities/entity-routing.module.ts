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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
