import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesPage } from './games.page';
import {PokerComponent} from './poker/poker.component';
import {HartenjagenComponent} from './hartenjagen/hartenjagen.component';
import {BoerenBridgeComponent} from './boeren-bridge/boeren-bridge.component';
import {SharedModule} from '../shared/shared.module';
import {CountdownModule} from 'ngx-countdown';
import {NameGameComponent} from './name-game/name-game.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    CountdownModule,
    RouterModule.forChild([{ path: '', component: GamesPage }])
  ],
  declarations: [
      GamesPage,
      PokerComponent,
      HartenjagenComponent,
      BoerenBridgeComponent,
      NameGameComponent
  ]
})
export class Tab2PageModule {}
