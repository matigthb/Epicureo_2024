import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrsPage } from './qrs.page';

describe('QrsPage', () => {
  let component: QrsPage;
  let fixture: ComponentFixture<QrsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
