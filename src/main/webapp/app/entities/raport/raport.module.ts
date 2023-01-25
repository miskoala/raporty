import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RaportComponent } from './list/raport.component';
import { RaportDetailComponent } from './detail/raport-detail.component';
import { RaportUpdateComponent } from './update/raport-update.component';
import { RaportDeleteDialogComponent } from './delete/raport-delete-dialog.component';
import { RaportRoutingModule } from './route/raport-routing.module';

@NgModule({
  imports: [SharedModule, RaportRoutingModule],
  declarations: [RaportComponent, RaportDetailComponent, RaportUpdateComponent, RaportDeleteDialogComponent],
})
export class RaportModule {}
