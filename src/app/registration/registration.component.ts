import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {AuthService} from "../service/auth.service";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzSpaceComponent} from "ng-zorro-antd/space";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
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
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.registrationForm.valid) {
      this.authService.registration(
        this.registrationForm.value.email,
        this.registrationForm.value.userName,
        this.registrationForm.value.password
      )
    } else {
      Object.values(this.registrationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
