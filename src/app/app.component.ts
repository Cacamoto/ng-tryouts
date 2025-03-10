import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, MatButtonModule],
  template: `
    <header>
      <mat-icon
        aria-hidden="true"
        aria-label="Stores Icon"
        fontIcon="warehouse"
      />
      <h1>{{ title }}</h1>
      @if (isTerminalRoute()) {
      <a class="acp_btn" mat-flat-button href="/login">ACP</a>
      } @else {
      <a class="acp_btn" mat-flat-button href="/terminal">Terminal</a>
      }
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [
    'header {background-color: rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center; padding: 0; margin: 0; gap: 4px;}',
    'h1 {text-transform: uppercase;}',
    'mat-icon {color: rgba(0, 0, 0, 0.8); font-size: 2rem; width: 2rem; height: 2rem;}',
    'main { display: flex; justify-content: center; align-items: start; margin-top: 1rem} ',
    '.acp_btn {position: absolute; right: 1rem}',
  ],
})
export class AppComponent {
  title = 'Prekių atsiėmimo terminalas';

  constructor(private router: Router) {}

  isTerminalRoute(): boolean {
    return this.router.url === '/terminal';
  }
}
