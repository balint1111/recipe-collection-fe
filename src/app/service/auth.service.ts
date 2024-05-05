import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {environment} from "../environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'any',
})
export class AuthService {
  static tokenKey = 'token';

  constructor(
    private requestService: RequestService,
    private router: Router,
  ) {
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(AuthService.tokenKey) : null;
  }

  login(email: string, password: string) {
    return this.requestService.post<{ token: string, }>(`${environment.apiUrl}/Authentication/Login`, {
        username: email,
        password: password
      }
    ).subscribe(response => {
        localStorage.setItem('token', response.content.token)
        this.router.navigate(['/'])
      }
    )
  }

  logout(): void {
    localStorage.removeItem(AuthService.tokenKey);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(AuthService.tokenKey);
    return token != null && token.length > 0;
  }


}
