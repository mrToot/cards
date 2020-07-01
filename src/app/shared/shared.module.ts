import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {SelectPlayersComponent} from './select-players/select-players.component';
import {SelectTeamsComponent} from './select-teams/select-teams.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    declarations: [SelectPlayersComponent, SelectTeamsComponent],
    exports: [SelectPlayersComponent, SelectTeamsComponent]
})
export class SharedModule {}
