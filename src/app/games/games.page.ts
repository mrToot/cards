import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CurrentGame, GameType, Player} from '../app.model';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss']
})
export class GamesPage implements OnInit{
  currentGame: CurrentGame;
  gameType = GameType;
  gameRef: AngularFireObject<any>;
  playersSelected = false;
  isPlaying = false;
  selectedGame: GameType;
  constructor(db: AngularFireDatabase, public actionSheetController: ActionSheetController) {
    this.gameRef = db.object<CurrentGame>('current');
  }

  public ngOnInit() {
    this.gameRef.snapshotChanges().subscribe((game) => {
          this.currentGame = game.payload.val();
          this.playersSelected = this.currentGame.playersSelected;
          this.isPlaying = this.currentGame.playing;
          console.log(this.currentGame)
        }
      );
  }

  public onPlayersSelected() {
      this.playersSelected = true;
      const newGame: CurrentGame = {
          playing: true,
          playersSelected: this.playersSelected,
          isCashgame: false,
          game: {
              gameType: this.selectedGame,
          },
          lastGameStarted: Date.now()
      };
      this.gameRef.set(newGame);
  }

  public onCloseGame() {
      this.presentActionSheet();
  }

  public selectGame(game: GameType) {
      this.isPlaying = true;
      this.selectedGame = game;
  }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Weet je het zeekaaah?',
            buttons: [{
                text: 'Stop met spelen',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.playersSelected = false;
                    this.isPlaying = false;
                    const newGame: CurrentGame = {
                        playing: false,
                        playersSelected: this.playersSelected
                    };
                    this.gameRef.set(newGame);
                }
            }, {
                text: 'Echt niet',
                icon: 'close',
                handler: () => {
                    console.log('Share clicked');
                }
            }]
        });
        await actionSheet.present();
    }
}
