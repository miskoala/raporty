import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrupaRaportow } from '../grupa-raportow.model';
import { GrupaRaportowService } from '../service/grupa-raportow.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './grupa-raportow-delete-dialog.component.html',
})
export class GrupaRaportowDeleteDialogComponent {
  grupaRaportow?: IGrupaRaportow;

  constructor(protected grupaRaportowService: GrupaRaportowService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grupaRaportowService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
