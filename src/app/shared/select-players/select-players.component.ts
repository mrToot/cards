import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Player} from '../../app.model';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {map} from 'rxjs/operators';
import {IonReorderGroup} from '@ionic/angular';

@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss'],
})
export class SelectPlayersComponent {
  players: Observable<Player[]>;
  playersRef: AngularFireList<any>;
  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;
  @Output() public playersSelected = new EventEmitter();

  constructor(db: AngularFireDatabase) {
    this.playersRef = db.list<Player>('players');
    this.players = this.playersRef.snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
    );
  }

  onCheckboxChange(key: string, isPlaying: boolean) {
    this.playersRef.update(key, { isPlaying: isPlaying});

  }

  selectPlayers() {
    this.playersSelected.next();
  }

  doReorder(ev: any) {
    console.log(ev)
    // Before complete is called with the items they will remain in the
    // order before the drag
    console.log('Before complete', this.players);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items
    this.players = ev.detail.complete(this.players);

    // After complete is called the items will be in the new order
    console.log('After complete', this.players);
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }


}
