import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {CurrentGame, Player} from '../app.model';
import {AngularFireDatabase} from '@angular/fire/database';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss']
})
export class GamesPage {
  currentGame: Observable<CurrentGame>;
  constructor(db: AngularFireDatabase,
              public actionSheetController: ActionSheetController
  ) {
    this.currentGame = db.object<CurrentGame>('current').valueChanges();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
