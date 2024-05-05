import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {AuthService} from "../service/auth.service";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzSpaceComponent} from "ng-zorro-antd/space";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormControlComponent,
    NzFormItemComponent,
    NzInputGroupComponent,
    NzFormDirective,
    NzInputDirective,
    NzButtonComponent,
    NzCardComponent,
    NzSpaceComponent
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.userName,
        this.loginForm.value.password
      )
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
