import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrentGame, Player} from '../../app.model';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {map} from 'rxjs/operators';
import { IonReorderGroup } from '@ionic/angular';

@Component({
  selector: 'app-hartenjagen',
  templateUrl: './hartenjagen.component.html',
  styleUrls: ['./hartenjagen.component.scss'],
})
export class HartenjagenComponent implements OnInit {
  currentGame: CurrentGame;
  gameNotStarted = true;
  maxScore = 50;
  centsPerPoint = 20;
  pointPerRound = 15;
  players: Player[];
  numberOfPlayers = 0;
  gameRef: AngularFireObject<any>;
  playersRef: AngularFireList<any>;
  gameEnded = false;
  roundScore = 0;

  constructor(
      db: AngularFireDatabase,
      public actionSheetController: ActionSheetController,
      public alertController: AlertController,
      public toastController: ToastController) {
    this.gameRef = db.object<CurrentGame>('current');
    this.gameRef.snapshotChanges().subscribe((game) => {
      this.currentGame = game.payload.val();
    });
    this.playersRef = db.list<Player>('players');
    this.playersRef.snapshotChanges().pipe(
        map(changes =>
            changes.map(player => ({ key: player.payload.key, ...player.payload.val() }))
        )
    ).subscribe((players) => this.players = players);
  }

  ngOnInit() {
  }

  onStart(){
    this.gameNotStarted = false;
    this.players.forEach(player => {
      this.playersRef.update(player.key, { score: 0});
      if (player.isPlaying) {
        this.numberOfPlayers ++;
      }
    });
    if (this.numberOfPlayers > 1) {
      this.gameNotStarted = false;
    } else {
      this.notEnoughPlayersToast()
    }
  }

  calculateRoundScore() {
    let roundScore = 0;
    this.players.forEach(player => {
      if  (player.isPlaying ) {
        roundScore = roundScore + player.actual;
      }
    });
    this.roundScore = roundScore;
    return this.roundScore;

  }

  private calculateRoundScoreIsCorrect() {
    console.log(this.numberOfPlayers);
    console.log('roundscore', this.roundScore);
    console.log('3 x', (this.numberOfPlayers - 1) * this.pointPerRound);
    console.log('min', -this.pointPerRound);
    if (this.roundScore === this.numberOfPlayers * this.pointPerRound) {
      return true;
    }
    if (this.roundScore === -this.pointPerRound) {
      return true;
    }
    return this.roundScore === this.pointPerRound
  }

  onRoundEnd() {
    if (!this.calculateRoundScoreIsCorrect()) {
      this.playersRemainingToast();
    } else {
      this.players.forEach(player => {
        const newScore = player.score + player.actual;
        this.playersRef.update(player.key, { actual: 0, score: newScore});
        this.startNewRoundToast();
      });
    }
  }

  calculateLosses(player) {
   return Math.round((player.score * (this.centsPerPoint / 100)) * 100) / 100;
  }

  canFinishGame() {
    let canEndGame = false;
    this.players.forEach(player => {
      if  (player.isPlaying && player.score === 0) {
        canEndGame = true;
      }
    });
   return canEndGame;
  }

  onGameEnd() {
    this.gameEnded = true;
  }

  onPayout() {
    let pot = 0;
    this.players.forEach(player => {
      if (!(player.score === 0)) {
        const losses = this.calculateLosses(player);
        pot = pot + this.calculateLosses(player);
        player.balance = Number(player.balance) - losses;
        console.log('name:', player.name );
        console.log('balance: ', player.balance);
        console.log('losses: ', losses);
        this.playersRef.update(player.key, {balance: player.balance});
      }
    });
    this.players.forEach(player => {
      if (player.isPlaying && player.score === 0) {
        player.balance = Number(player.balance) + pot;
        console.log('name:', player.name );
        console.log('balance: ', player.balance);
        console.log('wins: ', pot);
        this.playersRef.update(player.key, {balance: player.balance});
      }
    });

    const newGame: CurrentGame = {
      playing: false,
      playersSelected: false
    };
    this.gameRef.set(newGame);

  }


  async playersRemainingToast() {
    const toast = await this.toastController.create({
      message: 'Total is niet gelijk aan ' + this.pointPerRound + ' punten, nerd',
      duration: 2000
    });
    toast.present();
  }

  async notEnoughPlayersToast() {
    const toast = await this.toastController.create({
      message: 'Dude met minder dan 2 spelers kan je niet hartenjagen!',
      duration: 2000
    });
    toast.present();
  }

  async startNewRoundToast() {
    const toast = await this.toastController.create({
      message: 'Nieuwe ronde nieuwe kansen.',
      duration: 2000
    });
    toast.present();
  }
}
