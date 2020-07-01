import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Player, Team} from '../../app.model';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {map} from 'rxjs/operators';
import {IonReorderGroup} from '@ionic/angular';

@Component({
  selector: 'app-select-teams',
  templateUrl: './select-teams.component.html',
  styleUrls: ['./select-teams.component.scss'],
})
export class SelectTeamsComponent {
  teams: Observable<Team[]>;
  teamsRef: AngularFireList<any>;
  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;
  @Output() public teamsSelected = new EventEmitter();

  constructor(db: AngularFireDatabase) {
    this.teamsRef = db.list<Player>('teams');
    this.teams = this.teamsRef.snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
    );
  }

  onCheckboxChange(key: string, isPlaying: boolean) {
    console.log('key', key);
    console.log('isPlaying', isPlaying);
    this.teamsRef.update(key, { isPlaying: isPlaying});

  }

  selectTeams() {
    this.teamsSelected.next();
  }

  doReorder(ev: any) {
    console.log(ev);
    // Before complete is called with the items they will remain in the
    // order before the drag
    console.log('Before complete', this.teams);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items
    this.teams = ev.detail.complete(this.teams);

    // After complete is called the items will be in the new order
    console.log('After complete', this.teams);
  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }


}
