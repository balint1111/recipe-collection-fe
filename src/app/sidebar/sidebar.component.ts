import {Component, OnInit} from '@angular/core';
import {
  NzContentComponent,
  NzFooterComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent
} from "ng-zorro-antd/layout";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from "ng-zorro-antd/menu";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {AuthService, logout} from "../service/auth.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NzContentComponent,
    NzHeaderComponent,
    NzIconDirective,
    NzLayoutComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSiderComponent,
    NzSubMenuComponent,
    RouterLink,
    RouterOutlet,
    NzFooterComponent,
    NzColDirective,
    NzButtonComponent,
    NzRowDirective,
    AsyncPipe,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  isCollapsed = false;
  isLoggedIn$?: Observable<boolean | undefined>;


  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }

  logout() {
    logout()
    this.router.navigate(['/login'])
  }

  registration() {
    this.router.navigate(['/registration'])
  }

  login() {
    this.router.navigate(['/login']);
  }
}
