import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RequestService} from "../../../service/request.service";
import {environment, fallbackImg} from "../../../environment";
import {Router} from "@angular/router";
import {NzTableComponent} from "ng-zorro-antd/table";
import {NzUploadComponent, NzUploadFile} from "ng-zorro-antd/upload";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzImageDirective} from "ng-zorro-antd/image";
import {NgOptimizedImage} from "@angular/common";

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
    NzButtonComponent,
    NzTableComponent,
    NzUploadComponent,
    NzIconDirective,
    NzImageDirective,
    NgOptimizedImage
  ],
  styleUrls: ['./create-allergen.component.scss']
})
export class CreateAllergenComponent {
  allergenForm: FormGroup<{
    name: FormControl<string | null>,
    imgBase64: FormControl<string | null>,
  }>;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
  ) {
    this.allergenForm = this.fb.group({
      name: ['', Validators.required],
      imgBase64: ['', Validators.required],
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.readAsDataURL(file as any);
    reader.onload = () => {
      this.allergenForm.patchValue({
        imgBase64: reader.result?.toString(),
      });
    };
    return false; // Prevent automatic upload
  };

  submitForm(): void {
    if (this.allergenForm.valid) {
      this.requestService.post(`${environment.apiUrl}/Allergen/Create`,
        {
          name: this.allergenForm.value.name,
          imgBase64: this.allergenForm.value.imgBase64
        }).subscribe(response => {
        this.router.navigate(['/allergens'])
      })
    } else {
      Object.values(this.allergenForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  protected readonly fallbackImg = fallbackImg;
}
