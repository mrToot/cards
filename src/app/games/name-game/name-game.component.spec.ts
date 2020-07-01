import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NameGameComponent } from './name-game.component';

describe('NameGameComponent', () => {
  let component: NameGameComponent;
  let fixture: ComponentFixture<NameGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameGameComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NameGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
