import {Component, OnInit} from '@angular/core';
import {Player} from '../app.model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {FirebaseDeployConfig} from '@angular/fire/schematics/interfaces';
import {FirebaseDatabase} from '@angular/fire';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'losers.page.html',
  styleUrls: ['losers.page.scss']
})
export class Tab1Page{
  players: Observable<Player[]>;
  constructor(db: AngularFireDatabase) {
    this.players = db.list<Player>('players').valueChanges();
  }
}
