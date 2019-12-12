import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebetPage } from './sidebet.page';
import {NgxWheelModule} from 'ngx-wheel';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxWheelModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: SidebetPage }])
  ],
  declarations: [SidebetPage]
})
export class Tab3PageModule {}
