import {Component, ViewEncapsulation} from '@angular/core';
import {Player} from '../app.model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'sidebet.page.html',
  styleUrls: ['sidebet.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebetPage {
  players: Player[];
  playersPlaying: string[] = [];
  randomPlayer: string = '';
  numberOfPlayers = 0;
  randomNameGame = false;
  playersRef: AngularFireList<any>;

  constructor(
      db: AngularFireDatabase,
      public actionSheetController: ActionSheetController,
      public alertController: AlertController,
      public toastController: ToastController) {
    this.playersRef = db.list<Player>('players');
    this.playersRef.snapshotChanges().pipe(
        map(changes =>
            changes.map(player => ({ key: player.payload.key, ...player.payload.val() }))
        )
    ).subscribe((players) => this.players = players);
  }

  startRandomNameGame() {
    console.log(this.players);
    this.playersPlaying = [];
    this.players.forEach(player => {
      if (player.isPlaying) {
        this.playersPlaying.push(player.name);
        this.numberOfPlayers ++;
      }
    });
    this.randomPlayer = this.playersPlaying[Math.floor(Math.random()* this.playersPlaying.length)];
    this.randomNameGame = true;
    this.tooMuchMoneyToast()
  }

  onPlayersSelected() {
    this.players.forEach(player => {
      if (player.isPlaying) {
        this.playersPlaying.push(player.name);
        this.numberOfPlayers ++;
      }
    });
  }

  onAfterSpin(event) {
    // this.players.forEach((player) => {
    //   if (player.name === this.randomPlayer) {
    //     player.shots = player.shots + 1;
    //     this.playersRef.update(player.key, { shots: player.shots});
    //   }
    // })
  }

  async tooMuchMoneyToast() {
    const toast = await this.toastController.create({
      message: 'Nieuwe loser geselecteerd',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }
}
