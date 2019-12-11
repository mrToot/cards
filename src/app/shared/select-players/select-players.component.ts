import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {Player} from '../../app.model';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss'],
})
export class SelectPlayersComponent {
  players: Observable<Player[]>;
  playersRef: AngularFireList<any>;
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
    console.log('key', key);
    console.log('isPlaying', isPlaying);
    this.playersRef.update(key, { isPlaying: isPlaying});

  }

  selectPlayers() {
    this.playersSelected.next();
  }


}
