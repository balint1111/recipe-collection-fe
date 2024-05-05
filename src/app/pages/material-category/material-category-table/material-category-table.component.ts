import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzPaginationComponent, NzPaginationDefaultComponent} from "ng-zorro-antd/pagination";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";

export interface MaterialCategory {
  id: number
  name: string;
}

@Component({
  selector: 'app-material-category-table',
  templateUrl: './material-category-table.component.html',
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
  styleUrls: ['./material-category-table.component.scss']
})
export class MaterialCategoryTableComponent implements OnInit {
  private backendUrl: string = 'MaterialCategory'
  private url: string = 'material-category'
  public list: MaterialCategory[] = [];
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
    this.router.navigate([`/${this.url}/create`]);
  }

  loadPage(page: number, pageSize: number) {
    this.isLoading = true
    this.pageIndex = page
    this.pageSize = pageSize
    this.requestService.getPageable<MaterialCategory>(
      `${environment.apiUrl}/${this.backendUrl}/GetAllPageable?page=${this.pageIndex}&pageSize=${this.pageSize}`
    )
      .subscribe(response => {
          this.list = response.content.content;
          this.totalCount = response.content.totalCount;
          this.isLoading = false;
        }
      );
  }

  deleteAllergen(allergenId: number) {
    this.requestService.delete(`${environment.apiUrl}/${this.backendUrl}/Delete/${allergenId}`)
      .subscribe(response => {
        this.loadPage(this.pageIndex, this.pageSize)
      })
  }
}
