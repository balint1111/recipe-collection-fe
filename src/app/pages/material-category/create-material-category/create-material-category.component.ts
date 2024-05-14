import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {Router} from "@angular/router";
import {NzTableComponent} from "ng-zorro-antd/table";

@Component({
  selector: 'app-create-material-category',
  templateUrl: './create-material-category.component.html',
  standalone: true,
    imports: [
        NzFormItemComponent,
        NzFormDirective,
        ReactiveFormsModule,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzInputDirective,
        NzButtonComponent,
        NzTableComponent
    ],
  styleUrls: ['./create-material-category.component.scss']
})
export class CreateMaterialCategoryComponent {
  private backendUrl: string = 'MaterialCategory'
  private url: string = 'material-category'
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
      this.requestService.post(`${environment.apiUrl}/${this.backendUrl}/Create`,
        {
          name: this.allergenForm.value.name
        }).subscribe( response => {
          this.router.navigate([`/${this.url}`])
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
