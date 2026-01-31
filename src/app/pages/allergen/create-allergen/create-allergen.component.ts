import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RequestService} from "../../../service/request.service";
import {environment, fallbackImg} from "../../../environment";
import {ActivatedRoute, Router} from "@angular/router";
import {NzTableComponent} from "ng-zorro-antd/table";
import {NzUploadComponent, NzUploadFile} from "ng-zorro-antd/upload";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzImageDirective} from "ng-zorro-antd/image";
import {NgOptimizedImage} from "@angular/common";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {NzModalService} from "ng-zorro-antd/modal";
import {Allergen} from "../allergen-table/allergen-table.component";

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
export class CreateAllergenComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private backendUrl: string = 'Allergen'
  private url: string = 'allergens'
  protected id = new BehaviorSubject<number | null>(null)

  protected form: FormGroup<{
    id: FormControl<number | null>,
    name: FormControl<string | null>,
    imgBase64: FormControl<string | null>,
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
      imgBase64: ['', Validators.required],
    });
  }

  private setValues(response: Allergen) {
    this.form.patchValue(response);
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

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      this.id.next(id ? Number(id) : null);
    })
    this.id.pipe(takeUntil(this.destroy$)).subscribe(id => {
      if (id != null) {
        this.requestService.get<Allergen>(`${environment.apiUrl}/${this.backendUrl}/GetById/${id}`)
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
        ).pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.router.navigate([`/${this.url}`])
        })
      } else {
        this.requestService.put(`${environment.apiUrl}/${this.backendUrl}/Update`,
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
        nzTitle: 'Biztos vagy benne, hogy szerkeszteni akarod ezt az allergént?',
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

  protected readonly fallbackImg = fallbackImg;
}
