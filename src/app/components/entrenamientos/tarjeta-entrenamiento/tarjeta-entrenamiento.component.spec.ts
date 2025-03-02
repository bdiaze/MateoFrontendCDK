import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaEntrenamientoComponent } from './tarjeta-entrenamiento.component';

describe('TarjetaEntrenamientoComponent', () => {
  let component: TarjetaEntrenamientoComponent;
  let fixture: ComponentFixture<TarjetaEntrenamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaEntrenamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaEntrenamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
