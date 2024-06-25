import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {SidebarComponent} from "./sidebar/sidebar.component";

export const routes: Routes = [
  { path: '', component: SidebarComponent, loadChildren: () => import('./sidebar/sidebar.routes').then(m => m.SIDEBAR_ROUTES) },
];
