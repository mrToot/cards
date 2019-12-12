import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SidebetPage } from './sidebet.page';

describe('Tab3Page', () => {
  let component: SidebetPage;
  let fixture: ComponentFixture<SidebetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebetPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
