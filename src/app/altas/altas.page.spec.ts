import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltasPage } from './altas.page';

describe('AltasPage', () => {
  let component: AltasPage;
  let fixture: ComponentFixture<AltasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
