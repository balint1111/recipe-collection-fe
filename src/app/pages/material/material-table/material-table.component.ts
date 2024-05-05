import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzPaginationComponent, NzPaginationDefaultComponent} from "ng-zorro-antd/pagination";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";
import {MaterialCategory} from "../../material-category/material-category-table/material-category-table.component";
import {Allergen} from "../../allergen/allergen-table/allergen-table.component";

export interface Material {
  id: number
  name: string;
  materialCategory: MaterialCategory;
  allergens: Allergen[]
}

@Component({
  selector: 'app-recipe-table',
  templateUrl: './material-table.component.html',
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
  styleUrls: ['./material-table.component.scss']
})
export class MaterialTableComponent implements OnInit {
  private backendUrl: string = 'Material'
  private url: string = 'material'
  public list: Material[] = [];
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
    this.requestService.getPageable<Material>(
      `${environment.apiUrl}/${this.backendUrl}/GetAllPageable?page=${this.pageIndex}&pageSize=${this.pageSize}`
    )
      .subscribe(response => {
          this.list = response.content.content;
          this.totalCount = response.content.totalCount;
          this.isLoading = false;
        }
      );
  }

  mapAllergens(allergens: Allergen[]): string {
    return allergens.map( allergen => {
      return allergen.name
    }).join(', ')
  }

  deleteAllergen(allergenId: number) {
    this.requestService.delete(`${environment.apiUrl}/${this.backendUrl}/Delete/${allergenId}`)
      .subscribe(response => {
        this.loadPage(this.pageIndex, this.pageSize)
      })
  }
}
