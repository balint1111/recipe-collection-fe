import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {ActivatedRoute, Router} from "@angular/router";
import {NzTableComponent} from "ng-zorro-antd/table";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {NzModalService} from "ng-zorro-antd/modal";
import {MaterialCategory} from "../material-category-table/material-category-table.component";

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
export class CreateMaterialCategoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private backendUrl: string = 'MaterialCategory'
  private url: string = 'material-category'
  protected id = new BehaviorSubject<number | null>(null)
  protected form: FormGroup<{
    id: FormControl<number | null>,
    name: FormControl<string | null>,
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
      name: ['', Validators.required],
    });
  }

  private setValues(response: MaterialCategory) {
    this.form.patchValue(response);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      this.id.next(id ? Number(id) : null);
    })
    this.id.pipe(takeUntil(this.destroy$)).subscribe(id => {
      if (id != null) {
        this.requestService.get<MaterialCategory>(`${environment.apiUrl}/${this.backendUrl}/GetById/${id}`)
          .pipe(takeUntil(this.destroy$))
          .subscribe(response => {
            this.setValues(response.content);
          })
      }
    })
  }

  submitForm(): void {
    if (this.form.valid) {
      if (this.id.getValue() == null) {
        this.requestService.post(`${environment.apiUrl}/${this.backendUrl}/Create`,
          this.form.value
        ).pipe(takeUntil(this.destroy$)).subscribe( response => {
            this.router.navigate([`/${this.url}`])
        })
      } else {
        this.requestService.put(`${environment.apiUrl}/${this.backendUrl}/Update`,
          this.form.value
        ).pipe(takeUntil(this.destroy$)).subscribe( response => {
          this.router.navigate([`/${this.url}`])
        })
      }
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  showSubmitConfirm(): void {
    if (this.id.value == null) {
      this.submitForm()
    } else {
      this.modal.confirm({
        nzTitle: 'Biztos vagy benne, hogy szerkeszteni akarod ezt az alapanyag kategóriát?',
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
}
