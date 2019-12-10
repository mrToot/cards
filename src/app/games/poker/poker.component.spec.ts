import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PokerComponent } from './poker.component';

describe('PokerComponent', () => {
  let component: PokerComponent;
  let fixture: ComponentFixture<PokerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
