import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrentGame, Player} from '../../app.model';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {CountdownComponent} from 'ngx-countdown';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {first, map} from 'rxjs/operators';

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
  players: Player[];
  numberOfPlayers = 0;
  gameRef: AngularFireObject<any>;
  playersRef: AngularFireList<any>;
  gameEnded = false;

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
      this.numberOfPlayers ++;
      this.playersRef.update(player.key, { score: 0});
    });
    if (this.numberOfPlayers > 1) {
      this.gameNotStarted = false;
    } else {
      this.notEnoughPlayersToast()
    }
  }

  calculateLosses(player) {
   return Math.round((player.score * (this.centsPerPoint / 100)) * 100) / 100;
  }

  onGameEnd() {
    let canEndGame = false;
    this.players.forEach(player => {
      // player.pokerWinnings = 2;
      if  (player.isPlaying && player.score === 0) {
        canEndGame = true;
      }
      this.playersRef.update(player.key, { score: player.score});
    });
    console.log('players', this.players);
    if (canEndGame) {
      this.gameEnded = true;
    } else {
      this.playersRemainingToast()
    }
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
      message: 'Er heeft nog niemand gewonnen bitch!',
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
}
