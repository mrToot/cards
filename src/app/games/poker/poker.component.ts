import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CurrentGame, Player} from '../../app.model';
import {first, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {CountdownComponent} from 'ngx-countdown';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit {
    currentGame: CurrentGame;
    isCashgame = false;
    gameNotStarted = true;
    tournamentBuyin = 10;
    rebuyBuyin = 10;
    blindLevelTime = 10;
    blindLevel = 0;
    tournamentRanking: Player[] = [];
    blindlevels = [
        '1 / 2',
        '2 / 4',
        '3 / 6',
        '5 / 10',
        '10 / 20',
        '15 / 30',
        '20 / 40',
        '25 / 50',
    ];
    potAmount = 0;
    hasRebuy = false;
    rebuyTime = 30;
    rebuyFinished = false;
    players: Player[];
    numberOfPlayers = 0;
    gameRef: AngularFireObject<any>;
    playersRef: AngularFireList<any>;
    blindlevelFinished = true;
    tournamentEnded = false;
    @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

    constructor(
        db: AngularFireDatabase,
        public actionSheetController: ActionSheetController,
        public alertController: AlertController,
        public toastController: ToastController) {
      this.gameRef = db.object<CurrentGame>('current');
        this.gameRef.snapshotChanges().subscribe((game) => {
            this.currentGame = game.payload.val();
            this.isCashgame = this.currentGame.isCashgame;
        });
        this.playersRef = db.list<Player>('players');
        this.playersRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(player => ({ key: player.payload.key, ...player.payload.val() }))
            )
        ).subscribe((players) => {
            console.log(players);
            this.players = players
        })
    }

    ngOnInit() {
    }

    getRandomPlayer() {
        let randomPlayer: Player;
        randomPlayer = this.players[Math.floor(Math.random()*this.players.length)];
        return randomPlayer.name;

    }

  onPokergameChanged(event) {
    this.isCashgame = event.detail.value === "true";
      const game = {
          isCashgame: this.isCashgame
      };
      this.gameRef.update(game);
  }

  onStopTimer() {
        this.countdown.pause();
  }

  onStartTimer() {
        this.countdown.resume();
  }

    onToggleChange(event, player) {
        console.log('key    ', player.key);
        for (const player of this.players) {
            this.playersRef.update(player.key, {boughtIn: player.boughtIn});
        }
        player.isPlaying = event.detail.checked;
        if (this.gameNotStarted) {
            this.playersRef.update(player.key, {isPlaying: player.isPlaying});
            return;
        }
        if (!event.detail.checked) {
            if (!this.isCashgame) {
                this.tournamentRanking.push(player);
            } else {
                player.balance = Number(player.balance) + player.boughtIn;
                console.log('balance: ', player.balance);
                console.log('boughtIn: ', player.boughtIn);
            }
        }
        this.playersRef.update(player.key, { balance: player.balance, isPlaying: player.isPlaying , boughtIn: 0});
    }

    onStart() {
        this.numberOfPlayers = 0;
        this.potAmount = 0;
        const buyin = this.isCashgame ? -this.rebuyBuyin : this.tournamentBuyin;
        this.players.forEach(player => {
            if (player.isPlaying) {
                this.numberOfPlayers ++;
                this.potAmount = this.potAmount + buyin;
                this.playersRef.update(player.key, { boughtIn: buyin});
            } else {
                this.playersRef.update(player.key, { boughtIn: 0});
            }
        });
        if (this.numberOfPlayers > 1) {
            this.gameNotStarted = false;
        } else {
            this.notEnoughPlayersToast()
        }
    }

    rebuy(player: Player) {
        this.potAmount = this.potAmount + this.tournamentBuyin;
        player.boughtIn = player.boughtIn + this.tournamentBuyin;
    }

    onBlindLevelFinished(event){
        if (event.action === 'done') {
            this.blindLevel ++;
            this.blindlevelFinished = true;
        }
        if (this.hasRebuy && !this.rebuyFinished) {
            const blindlevelSeconds = this.blindLevelTime * 60;
            const rebuySeconds = this.rebuyTime * 60;
            const levelSeconds = blindlevelSeconds - (event.left / 1000);
            const finishedLevelSeconds = blindlevelSeconds * this.blindLevel;
            const secondsPast = finishedLevelSeconds + levelSeconds;
            if (rebuySeconds <= secondsPast) {
                this.rebuyFinished = true;
                this.presentAlert()
            }
        }
    }

    onBlindleveStart() {
        this.blindlevelFinished = false;
        this.countdown.restart();
        this.countdown.begin();
    }

  onGameEnd() {
      console.log('number of player', this.numberOfPlayers);
      console.log('tournamentRankings', this.tournamentRanking.length);
      if ( !this.isCashgame && !(this.numberOfPlayers <= this.tournamentRanking.length)) {
          return this.playersRemainingToast();
      }

        if (!this.tournamentEnded && !this.isCashgame) {
            return this.tournamentEnded = true
        }
      this.presentActionSheet();
  }

  onPayout() {
        let totalWinnings = 0;
        console.log(this.tournamentRanking);
      for (const player of this.tournamentRanking) {
          if (!player.pokerWinnings) {
              continue;
          }
          totalWinnings = totalWinnings + player.pokerWinnings;
      }
      if (totalWinnings !== this.potAmount) {
          return this.tooMuchMoneyToast();
      }
      for (const player of this.tournamentRanking) {
          player.balance = Number(player.balance) + player.pokerWinnings;
          console.log('balance: ', player.balance);
          console.log('boughtIn: ', player.pokerWinnings);
          this.playersRef.update(player.key, { balance: player.balance,});
      }
      const newGame: CurrentGame = {
          playing: false,
          playersSelected: false
      };
      this.gameRef.set(newGame);

  }


    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Weet je het zeekaaah?',
            buttons: [{
                text: 'Stop met spelen',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    for (const player of this.players) {
                        this.playersRef.update(player.key, { boughtIn: player.boughtIn});
                    }
                    const newGame: CurrentGame = {
                        playing: false,
                        playersSelected: false
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

    async presentAlert() {
        const alert = await this.alertController.create({
            header: 'Rebuy afgelopen',
            message: 'Nee ' + this.getRandomPlayer() + ' je kan niet meer rebuyen.',
            buttons: ['OK']
        });

        await alert.present();
    }

    async playersRemainingToast() {
        const toast = await this.toastController.create({
            message: 'Er zijn nog spelers over, kudth!',
            color: 'danger',
            duration: 2000
        });
        toast.present();
    }

    async notEnoughPlayersToast() {
        const toast = await this.toastController.create({
            message: 'Dude met minder dan 2 spelers kan je niet pokeren!',
            color: 'danger',
            duration: 2000
        });
        toast.present();
    }

    async tooMuchMoneyToast() {
        const toast = await this.toastController.create({
            message: 'Valsspelers!!! Je kan niet meer uitkeren dan in de pot, snitches',
            color: 'danger',
            duration: 2000
        });
        toast.present();
    }
}
