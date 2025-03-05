import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoginScreenComponent } from './login-screen/login-screen.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, LoginScreenComponent],
  template: `
    <header>
      <mat-icon
        aria-hidden="true"
        aria-label="Stores Icon"
        fontIcon="warehouse"
      />
      <h1>{{ title }}</h1>
    </header>
    <main>
      @if (2 > 1) {
      <app-login-screen />
      }
    </main>

    <router-outlet />
  `,
  styles: [
    'header {background-color: rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center; padding: 0; margin: 0; gap: 4px;}',
    'h1 {text-transform: uppercase;}',
    'mat-icon {color: rgba(0, 0, 0, 0.8); font-size: 2rem; width: 2rem; height: 2rem;}',
    'main { display: flex; justify-content: center; align-items: start; margin-top: 1rem} ',
  ],
})
export class AppComponent {
  title = 'Prekių atsiėmimo terminalas';
}
