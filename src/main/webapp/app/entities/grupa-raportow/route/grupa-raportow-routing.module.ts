import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrupaRaportowComponent } from '../list/grupa-raportow.component';
import { GrupaRaportowDetailComponent } from '../detail/grupa-raportow-detail.component';
import { GrupaRaportowUpdateComponent } from '../update/grupa-raportow-update.component';
import { GrupaRaportowRoutingResolveService } from './grupa-raportow-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const grupaRaportowRoute: Routes = [
  {
    path: '',
    component: GrupaRaportowComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrupaRaportowDetailComponent,
    resolve: {
      grupaRaportow: GrupaRaportowRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrupaRaportowUpdateComponent,
    resolve: {
      grupaRaportow: GrupaRaportowRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrupaRaportowUpdateComponent,
    resolve: {
      grupaRaportow: GrupaRaportowRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grupaRaportowRoute)],
  exports: [RouterModule],
})
export class GrupaRaportowRoutingModule {}
