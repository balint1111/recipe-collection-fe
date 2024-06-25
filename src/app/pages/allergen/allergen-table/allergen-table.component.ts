import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzPaginationComponent, NzPaginationDefaultComponent} from "ng-zorro-antd/pagination";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";

export interface Allergen {
  id: number
  name: string
  imgBase64: string;
}

@Component({
  selector: 'app-all-ergen',
  templateUrl: './allergen-table.component.html',
  standalone: true,
  imports: [
    NzIconModule,
    NzTableComponent,
    NzThMeasureDirective,
    NzPaginationComponent,
    NgForOf,
    NzPaginationDefaultComponent,
    NzButtonComponent,
    NzIconDirective
  ],
  styleUrls: ['./allergen-table.component.scss']
})
export class AllergenTableComponent implements OnInit {
  public list: Allergen[] = [];
  public isLoading = true;
  public pageIndex = 1;
  public pageSize = 10;
  public totalCount = 0;

  constructor(
    private requestService: RequestService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadPage(this.pageIndex, this.pageSize);
  }

  navigateToCreate() {
    this.router.navigate(['/allergens/create']);
  }

  loadPage(page: number, pageSize: number) {
    this.isLoading = true
    this.pageIndex = page
    this.pageSize = pageSize
    this.requestService.getPageable<Allergen>(`${environment.apiUrl}/Allergen/GetAllPageable?page=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(response => {
          this.list = response.content.content;
          this.totalCount = response.content.totalCount;
          this.isLoading = false;
        }
      );
  }

  deleteAllergen(allergenId: number) {
    this.requestService.delete(`${environment.apiUrl}/Allergen/Delete/${allergenId}`)
      .subscribe( response => {
        this.loadPage(this.pageIndex, this.pageSize)
      })
  }
}
