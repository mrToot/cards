import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {ActionSheetController, IonReorderGroup} from '@ionic/angular';

@Component({
  selector: 'app-select-teams',
  templateUrl: './select-teams.component.html',
  styleUrls: ['./select-teams.component.scss'],
})
export class SelectTeamsComponent {
  namesRef: AngularFireList<any>;
  names: Observable<any>;
  newNames = {
    firstName: '',
    secondName: '',
    thirdName: '',
    fourthName: '',
    lastName: ''
  };
  @ViewChild(IonReorderGroup, { static: false }) reorderGroup: IonReorderGroup;
  @Output() public namesSelected = new EventEmitter();

  constructor(db: AngularFireDatabase, public actionSheetController: ActionSheetController) {
    this.namesRef = db.list<string>('names');
  }

  onSelectNames() {
    this.presentActionSheet();
  }

  selectNames() {
    this.pushNameToDb(this.newNames.firstName);
    this.pushNameToDb(this.newNames.secondName);
    this.pushNameToDb(this.newNames.thirdName);
    this.pushNameToDb(this.newNames.fourthName);
    this.pushNameToDb(this.newNames.lastName);
    this.namesSelected.next();
  }

  pushNameToDb(name: string) {
    if (name.length) {
      this.namesRef.push(name);
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you ready with the names?',
      buttons: [{
        text: 'Yes mistah',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
         this.selectNames()
        }
      }, {
        text: 'Hellz No',
        icon: 'close',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

}
