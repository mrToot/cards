import {Component, OnInit, ViewChild} from '@angular/core';
import {CountdownComponent} from 'ngx-countdown';
import {CurrentGame, Player, TempNames} from '../../app.model';
import {map} from 'rxjs/operators';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import random from '@angular-devkit/schematics/src/rules/random';

@Component({
  selector: 'app-name-game',
  templateUrl: './name-game.component.html',
  styleUrls: ['./name-game.component.scss'],
})
export class NameGameComponent implements OnInit {
  public gameStarted = true;
  blindLevelTime = 10;
  currentBlindLevel = 0;
  tempNamesRef: AngularFireObject<any>;
  namesRef: AngularFireList<any>;
  gameRef: AngularFireObject<any>;
  tempNames: TempNames;
  currentGame: CurrentGame;
  names: string[];
  originalNames: string[];
  currentName: string;
  playerSelected: boolean;
  iAmPlaying = false;
  playerUuid = '';
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  constructor(db: AngularFireDatabase) {
    this.gameRef = db.object<CurrentGame>('current');
    this.gameRef.snapshotChanges().subscribe((game) => {
          this.currentGame = game.payload.val();
          this.playerSelected = this.currentGame.playerSelected;
          this.gameStarted = this.currentGame.gameStarted;
          this.currentBlindLevel = this.currentGame.blindLevel;
          this.iAmPlaying = this.currentGame.currentPlayer === this.playerUuid;
        }
    );
    this.tempNamesRef = db.object<TempNames>('tempNames');
    this.tempNamesRef.snapshotChanges().subscribe((game) => {
      this.tempNames = game.payload.val();
      this.getRandomName();
    });

    this.namesRef = db.list<string>('names');
    this.namesRef.snapshotChanges().pipe(
        map(changes =>
            changes.map((name) => name.payload.val())
        )
    ).subscribe((names) => {
      this.originalNames = names;
      this.names = names;
      this.tempNamesRef.update({
        names: names.toString(),
        currentName: ''
      });
      this.getRandomName();
    })
  }

  ngOnInit() {
    let localStorageUuid = localStorage.getItem('cardsUuid');
    if (localStorageUuid) {
      this.playerUuid = localStorageUuid;
    } else {
      this.playerUuid = this.guidGenerator();
      localStorage.setItem('cardsUuid', this.playerUuid);
    }
  }

  onStartRound() {
    this.currentBlindLevel ++;
    this.gameRef.update({gameStarted: true, blindLevel: this.currentBlindLevel});
  }


  getRandomName() {
    let names = this.tempNames.names.split(',');
    console.log('names: ', names);
    this.currentName = names[Math.floor(Math.random() * names.length)];
  }

  onRoundFinished() {
    this.gameStarted = false;
    this.gameRef.update({playerSelected: false, gameStarted: false});
    this.tempNamesRef.update({names: this.originalNames.toString()});
  }

  onNameComplete() {
    const names = this.tempNames.names.split(',');
    const index = names.indexOf(this.currentName);
    if (index > -1) {
      names.splice(index, 1);
    }
    console.log('names in onNameComplete', names);
    this.tempNamesRef.update({names: names.toString()});

    if (!names.length) {
      this.onRoundFinished()
    }
  }

  onNamePassed() {
    this.getRandomName();
  }

  onPlayerFinished() {
    this.gameRef.update({playerSelected: false});
  }

  onPlayerStart() {
    this.getRandomName();
    this.gameRef.update({playerSelected: true, currentPlayer: this.playerUuid});
  }

  guidGenerator() {
    const S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

}
