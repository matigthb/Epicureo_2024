import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaDuenoSuperPage } from './alta-dueno-super.page';

describe('AltaDuenoSuperPage', () => {
  let component: AltaDuenoSuperPage;
  let fixture: ComponentFixture<AltaDuenoSuperPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaDuenoSuperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
