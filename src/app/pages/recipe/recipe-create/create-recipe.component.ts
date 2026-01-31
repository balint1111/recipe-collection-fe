import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RequestService} from "../../../service/request.service";
import {environment, fallbackImg} from "../../../environment";
import {ActivatedRoute, Router} from "@angular/router";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Material} from "../../material/material-table/material-table.component";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective} from "ng-zorro-antd/grid";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {Recipe} from "../recipe-table/recipe-table.component";
import {BehaviorSubject, map, Observable, Subject, Subscription, takeUntil} from "rxjs";
import {NzUploadComponent, NzUploadFile} from "ng-zorro-antd/upload";
import {NzModalService} from "ng-zorro-antd/modal";


interface Ingredient {
  id: FormControl<number | null>,
  materialId: FormControl<number | null>
  unit: FormControl<string | null>
  quantity: FormControl<number | null>
}

interface IngredientGroup {
  id: FormControl<number | null>,
  name: FormControl<string | null>,
  ingredients: FormArray<FormGroup<Ingredient>>
}

@Component({
  selector: 'app-create-material',
  templateUrl: './create-recipe.component.html',
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
    NzTableComponent,
    NzThMeasureDirective,
    NzCardComponent,
    NzColDirective,
    NzIconDirective,
    FormsModule,
    NzUploadComponent,
    AsyncPipe,
    NgIf
  ],
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private backendUrl: string = 'Recipe'
  private url: string = 'recipe'
  protected id = new BehaviorSubject<number | null>(null)

  protected materialList: Material[] = [];
  protected form: FormGroup<{
    id: FormControl<number | null>,
    code: FormControl<string | null>
    name: FormControl<string | null>
    imgBase64: FormControl<string | null>
    description: FormControl<string | null>
    preparationDuration: FormControl<number | null>
    cookingDuration: FormControl<number | null>
    ingredientGroups: FormArray<FormGroup<IngredientGroup>>
  }>;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private route: ActivatedRoute,
    private modal: NzModalService,
  ) {
    this.form = this.fb.group({
      id: this.fb.control<number | null>(null),
      code: ['', Validators.required],
      name: ['', Validators.required],
      imgBase64: new FormControl<string | null>(null),
      description: ['', Validators.required],
      preparationDuration: [0, Validators.required],
      cookingDuration: [0, Validators.required],
      ingredientGroups: this.fb.array<FormGroup<IngredientGroup>>([])
    })
  }

  private setValues(response: Recipe) {
    this.form.patchValue(response)
    response.ingredientGroups.forEach((it, i) => {
        this.addIngredientGroup(it.id, it.name)
        it.ingredients.forEach((ingredient, k) => {
          this.addIngredient(i, ingredient.id, ingredient.material.id, ingredient.unit, ingredient.quantity)
        })
      }
    )
  }

  get ingredientGroups() {
    return this.form.get('ingredientGroups') as FormArray<FormGroup<IngredientGroup>>;
  }

  addIngredientGroup(id: number | null = null, name: string = '') {
    this.ingredientGroups.push(this.fb.group({
      id: this.fb.control<number | null>(id),
      name: [name, Validators.required],
      ingredients: this.fb.array<FormGroup<Ingredient>>([])
    }))
  }

  deleteIngredientGroup(i: number) {
    this.ingredientGroups.removeAt(i)
  }

  ingredientsOfIngredientGroup(i: number) {
    return (this.ingredientGroups.at(i) as FormGroup).get('ingredients') as FormArray<FormGroup<Ingredient>>
  }

  addIngredient(i: number, id: number | null = null, materialId: number | null = null, unit: string = '', quantity: number = 1) {
    this.ingredientsOfIngredientGroup(i).push(
      this.fb.group({
          id: this.fb.control<number | null>(id),
          materialId: this.fb.control<number | null>(materialId, Validators.required),
          unit: [unit, Validators.required],
          quantity: [quantity, Validators.required],
        }
      ))
  }

  deleteIngredient(i: number, k: number) {
    this.ingredientsOfIngredientGroup(i).removeAt(k)
  }

  ngOnInit(): void {
    this.requestService.getList<Material>(`${environment.apiUrl}/Material/GetAll`)
      .pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.materialList = response.content;
      }
    );
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params =>
      this.id.next(params['id'])
    )
    this.id.pipe(takeUntil(this.destroy$)).subscribe(id => {
        id == null || this.requestService.get<Recipe>(
          `${environment.apiUrl}/${this.backendUrl}/GetById/${id}`
        ).pipe(takeUntil(this.destroy$)).subscribe(response => {
            this.setValues(response.content);
          }
        )
        if (id == null) {
          this.addIngredientGroup()
          this.addIngredient(0)
        }
      }
    )
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    let extension = file.name.split('.').pop()
    if (
      (extension != undefined && ["png", "jpg"].indexOf(extension) > -1
        || file.type != undefined && ["image/png", "image/jpeg"].indexOf(file.type) > -1)
      && (file.size !== undefined && file.size < 5000000)
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file as any);
      reader.onload = () => {
        this.form.patchValue({
          imgBase64: reader.result?.toString(),
        });
      };
    }
    return false; // Prevent automatic upload
  };

  submitForm(): void {
    if (this.form.valid) {
      if (this.id.getValue() == null) {
        this.requestService.post(`${environment.apiUrl}/${this.backendUrl}/CreateFull`,
          this.form.value
        ).pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.router.navigate([`/${this.url}`])
        })
      } else {
        this.requestService.put(`${environment.apiUrl}/${this.backendUrl}/UpdateFull`,
          this.form.value
        ).pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.router.navigate([`/${this.url}`])
        })
      }
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  showSubmitConfirm(): void {
    if (this.id.value == null) {
      this.submitForm()
    } else {
      this.modal.confirm({
        nzTitle: 'Biztos vagy benne, hogy szerkeszteni akarod ezt a receptet?',
        nzContent: 'Ezt a műveletet nem lehet visszavonni',
        nzCancelText: "Mégse",
        nzOkText: "OK",
        nzWidth: 600,
        nzCentered: true,
        nzOnOk: () => this.submitForm()
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly FormControl = FormControl;
  protected readonly fallbackImg = fallbackImg;
}
