import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {Router} from "@angular/router";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NgForOf} from "@angular/common";
import {Allergen} from "../../allergen/allergen-table/allergen-table.component";
import {MaterialCategory} from "../../material-category/material-category-table/material-category-table.component";
import {NzTableComponent} from "ng-zorro-antd/table";

@Component({
  selector: 'app-create-material',
  templateUrl: './create-material.component.html',
  standalone: true,
    imports: [
        NzFormItemComponent,
        NzFormDirective,
        ReactiveFormsModule,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzInputDirective,
        NzButtonComponent,
        NzSelectComponent,
        NgForOf,
        NzOptionComponent,
        NzTableComponent
    ],
  styleUrls: ['./create-material.component.scss']
})
export class CreateMaterialComponent implements OnInit{
  private backendUrl: string = 'Material'
  private url: string = 'material'

  protected allergenList: Allergen[] = [];
  protected materialCategoryList: MaterialCategory[] = [];
  protected materialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
  ) {
    this.materialForm = this.fb.group({
      name: new FormControl('', Validators.required),
      allergenIds: new FormControl<number[]>( [], Validators.required),
      materialCategoryId: new FormControl<number|null>( null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.requestService.getList<Allergen>(`${environment.apiUrl}/Allergen/GetAll`)
      .subscribe(response => {
          this.allergenList = response.content;
        }
      );
    this.requestService.getList<MaterialCategory>(`${environment.apiUrl}/MaterialCategory/GetAll`)
      .subscribe(response => {
          this.materialCategoryList = response.content;
        }
      );
  }

  submitForm(): void {
    if (this.materialForm.valid) {
      this.requestService.post(`${environment.apiUrl}/${this.backendUrl}/Create`,
        {
          name: this.materialForm.value.name,
          allergenIds: this.materialForm.value.allergenIds,
          materialCategoryId: this.materialForm.value.materialCategoryId
        }).subscribe( response => {
          this.router.navigate([`/${this.url}`])
      })
    } else {
      Object.values(this.materialForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
