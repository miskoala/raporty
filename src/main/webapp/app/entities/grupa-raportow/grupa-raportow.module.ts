import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrupaRaportowComponent } from './list/grupa-raportow.component';
import { GrupaRaportowDetailComponent } from './detail/grupa-raportow-detail.component';
import { GrupaRaportowUpdateComponent } from './update/grupa-raportow-update.component';
import { GrupaRaportowDeleteDialogComponent } from './delete/grupa-raportow-delete-dialog.component';
import { GrupaRaportowRoutingModule } from './route/grupa-raportow-routing.module';

@NgModule({
  imports: [SharedModule, GrupaRaportowRoutingModule],
  declarations: [GrupaRaportowComponent, GrupaRaportowDetailComponent, GrupaRaportowUpdateComponent, GrupaRaportowDeleteDialogComponent],
})
export class GrupaRaportowModule {}
