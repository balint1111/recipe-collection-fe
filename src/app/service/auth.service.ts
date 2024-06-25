import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {environment} from "../environment";
import {Router} from "@angular/router";
import {BehaviorSubject, distinctUntilChanged, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static tokenKey = 'token';

  constructor(
    private requestService: RequestService,
    private router: Router,
  ) {
    const token = localStorage.getItem(AuthService.tokenKey);
    loggedIn.next(!!token);
  }

  get isLoggedIn(): Observable<boolean | undefined> {
    return loggedIn.asObservable();
  }

  public getToken(): string | null {
    return loggedIn.value ? localStorage.getItem(AuthService.tokenKey) : null;
  }

  login(email: string, password: string) {
    return this.requestService.post<{ token: string, }>(`${environment.apiUrl}/Authentication/Login`, {
        username: email,
        password: password
      }
    ).subscribe(response => {
        localStorage.setItem('token', response.content.token)
        this.router.navigate(['/'])
        loggedIn.next(true)
      }
    )
  }

  registration(email: string, username: string, password: string) {
    return this.requestService.post<{ }>(`${environment.apiUrl}/Authentication/RegisterUser`, {
        email: email,
        username: username,
        name: username,
        password: password,
        settlement: "Veszprém",
        country: "Magyarország"
      }
    ).subscribe(response => {
        console.log("sikeres reg")
        this.router.navigate(['/login'])
      }
    )
  }

}

export const loggedIn: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);

export function logout(): void {
  loggedIn.next(false)
  localStorage.removeItem(AuthService.tokenKey);
}
