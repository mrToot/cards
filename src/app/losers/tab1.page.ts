import {Component} from '@angular/core';
import {Team} from '../app.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'losers.page.html',
  styleUrls: ['losers.page.scss']
})
export class Tab1Page{
  teams: Observable<Team[]>;
  isAddingTeams = false;
  godMode = true;

  constructor(db: AngularFireDatabase) {
    this.teams = db.list<Team>('teams').valueChanges();
  }

  addTeam() {
    this.isAddingTeams = true;
  }

  onTeamsSelected() {
    this.isAddingTeams = false;
  }
}
