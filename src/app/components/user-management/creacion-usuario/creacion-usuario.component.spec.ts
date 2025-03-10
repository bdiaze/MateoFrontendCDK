import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionUsuarioComponent } from './creacion-usuario.component';

describe('CreacionUsuarioComponent', () => {
  let component: CreacionUsuarioComponent;
  let fixture: ComponentFixture<CreacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreacionUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
