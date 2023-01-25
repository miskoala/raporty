import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RaportComponent } from '../list/raport.component';
import { RaportDetailComponent } from '../detail/raport-detail.component';
import { RaportUpdateComponent } from '../update/raport-update.component';
import { RaportRoutingResolveService } from './raport-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const raportRoute: Routes = [
  {
    path: '',
    component: RaportComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RaportDetailComponent,
    resolve: {
      raport: RaportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RaportUpdateComponent,
    resolve: {
      raport: RaportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RaportUpdateComponent,
    resolve: {
      raport: RaportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(raportRoute)],
  exports: [RouterModule],
})
export class RaportRoutingModule {}
