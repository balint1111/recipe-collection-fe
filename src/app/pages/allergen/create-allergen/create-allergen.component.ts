import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-allergen',
  templateUrl: './create-allergen.component.html',
  standalone: true,
  imports: [
    NzFormItemComponent,
    NzFormDirective,
    ReactiveFormsModule,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzButtonComponent
  ],
  styleUrls: ['./create-allergen.component.scss']
})
export class CreateAllergenComponent {
  allergenForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
  ) {
    this.allergenForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  submitForm(): void {
    if (this.allergenForm.valid) {
      console.log(this.allergenForm.value)
      this.requestService.post(`${environment.apiUrl}/Allergen/Create`,
        {
          name: this.allergenForm.value.name
        }).subscribe( response => {
          this.router.navigate(['/allergens'])
      })
    } else {
      Object.values(this.allergenForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
