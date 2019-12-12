import { Component, OnInit } from '@angular/core';
import {CurrentGame, Player} from '../../app.model';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-boeren-bridge',
  templateUrl: './boeren-bridge.component.html',
  styleUrls: ['./boeren-bridge.component.scss'],
})
export class BoerenBridgeComponent implements OnInit {
  currentGame: CurrentGame;
  gameNotStarted = true;
  maxRound = 2;
  centsPerPoint = 20;
  pointPerRound = 15;
  players: Player[];
  numberOfPlayers = 0;
  gameRef: AngularFireObject<any>;
  playersRef: AngularFireList<any>;
  isGuessing = true;
  gameEnded = false;
  roundScore = 0;
  gameRound = 1;
  gameRoundMetEnZonder = 0;
  winner: Player;

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

  calculateRoundScore(player) {
    if (player.actual === player.guess) {
      return 10 + (1 * player.actual)
    } else {
      return -Math.abs(player.actual - player.guess)
    }
  }

  onStartRound() {
    let totalRoundAmount = 0;
    let wrongAmount = false;
    this.players.forEach(player => {
      if (player.guess > this.gameRound) {
        console.log('Klopt niet jongen');
        wrongAmount = true;
      }
      totalRoundAmount = totalRoundAmount + player.guess;
      this.playersRef.update(player.key, { actual: 0, guess: player.guess});
    });
    if (wrongAmount) {
      return this.guessBiggerThanGameRoundToast();
    }
    if (totalRoundAmount !== this.gameRound){
      this.isGuessing = false;
      this.roundStaredSuccesfulldToast();
    } else {
      this.roundStaredUnSuccesfulldToast();
    }
  }

  onRoundEnd() {
    let totalRoundAmount = 0;
    this.players.forEach(player => {
      totalRoundAmount = totalRoundAmount + player.actual;
    });

    if (totalRoundAmount !== this.gameRound) {
      return this.roundTotalUnSuccesfulldToast();
    }

    this.players.forEach(player => {
      const newScore = player.score + this.calculateRoundScore(player);
      this.playersRef.update(player.key, { actual: 0, guess:0, score: newScore});
      this.startNewRoundToast();
    });

    this.isGuessing = true;
    if (this.gameRoundMetEnZonder > 2) {
      if (this.gameRound === 1) {
        this.gameEnded = true;
      }
      return this.gameRound --;
    }

    if (this.gameRound < (this.maxRound -1 )) {
      return this.gameRound ++
    } else if (this.gameRoundMetEnZonder === 0){
      this.gameRound ++;
      return this.gameRoundMetEnZonder ++;
    } else {
      return this.gameRoundMetEnZonder ++
    }
  }

  calculateWinner() {
    let multiplewinners: Player[];
    this.players.forEach(player => {
      if (!player.isPlaying){
        return;
      }
      this.playersRef.update(player.key, { actual: 0, guess:0, score: player.score});
      console.log('player', player);
      if (!this.winner || this.winner && (this.winner.score < player.score)) {
        this.winner = player;
      } else if (this.winner && (this.winner.score < player.score)) {
        multiplewinners.push(player);
      }
    });
    console.log('this.winner', this.winner);
    if (!this.winner) {
      return this.noWinnerToast();
    }
  }

  calculateLosses(player) {
    if (!this.winner) {
      this.calculateWinner();
    }
    if (player.key === this.winner.key) {
      return 0
    }
    const pointAwayFromRinner = this.winner.score - player.score;
    return Math.round((pointAwayFromRinner * (this.centsPerPoint / 100)) * 100) / 100;
  }

  onGameEnd() {
    this.gameEnded = true;
  }

  onPayout() {
    let pot = 0;
    this.players.forEach(player => {
      if (!player.isPlaying){
        return;
      }
      player.pokerWinnings = this.calculateLosses(player);
      pot = pot + player.pokerWinnings;
      player.balance = Number(player.balance) - player.pokerWinnings;
      console.log('name:', player.name );
      console.log('balance: ', player.balance);
      console.log('losses: ', player.pokerWinnings);
      this.playersRef.update(player.key, {balance: player.balance});
    });
    this.players.forEach(player => {
      if (!player.isPlaying){
        return;
      }
      if (player.key === this.winner.key) {
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
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  async notEnoughPlayersToast() {
    const toast = await this.toastController.create({
      message: 'Dude met minder dan 2 spelers kan je niet hartenjagen!',
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  async roundStaredSuccesfulldToast() {
    const toast = await this.toastController.create({
      message: 'Ronde wordt gestart',
      duration: 2000
    });
    toast.present();
  }

  async roundStaredUnSuccesfulldToast() {
    const toast = await this.toastController.create({
      message: 'Het mag niet kloppen losers',
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  async roundTotalUnSuccesfulldToast() {
    const toast = await this.toastController.create({
      message: 'Totale hoeveel klopt niet bitches',
      color: 'danger',
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

  async guessBiggerThanGameRoundToast() {
    const toast = await this.toastController.create({
      message: 'Dude, je gok is meer dan de kaarten. Ben je dronken?',
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  async noWinnerToast() {
    const toast = await this.toastController.create({
      message: 'Er is een fout opgetreden want er is geen winnaar',
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }
}
