import { Routes } from '@angular/router';
import { TerminalComponent } from './terminal/terminal.component';
import { LoginComponent } from './login/login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', redirectTo: '/terminal', pathMatch: 'full' },
  { path: 'terminal', component: TerminalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'acp', component: AdminPanelComponent },
];
