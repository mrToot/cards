import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HartenjagenComponent } from './hartenjagen.component';

describe('HartenjagenComponent', () => {
  let component: HartenjagenComponent;
  let fixture: ComponentFixture<HartenjagenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HartenjagenComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HartenjagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
