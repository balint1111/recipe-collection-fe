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
import {AuthService} from "../service/auth.service";

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
    NzRowDirective
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  isCollapsed = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  logout() {
    this.authService.logout()
  }

  ngOnInit(): void {
    if (this.authService.getToken() == null) {
      this.router.navigate(['/login']);
    }
  }
}
