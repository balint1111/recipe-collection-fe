import { Routes } from '@angular/router';
import {WelcomeComponent} from "./pages/welcome/welcome.component";
import {LoginComponent} from "./login/login.component";
import {SidebarComponent} from "./sidebar/sidebar.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: SidebarComponent, loadChildren: () => import('./sidebar/sidebar.routes').then(m => m.SIDEBAR_ROUTES) },
];
