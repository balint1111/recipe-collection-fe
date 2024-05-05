import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {NzTableComponent, NzThMeasureDirective} from "ng-zorro-antd/table";
import {NzPaginationComponent, NzPaginationDefaultComponent} from "ng-zorro-antd/pagination";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";
import {Material} from "../../material/material-table/material-table.component";

export interface Recipe {
  id: number
  code: string
  name: string
  description: string
  ingredientGroups: IngredientGroup[]
  preparationDuration: number
  cookingDuration: number
  totalDuration: number
}

interface IngredientGroup {
  id: number
  name: string
  ingredients: Ingredient[]
}

export interface Ingredient {
  id: number
  material: Material
  unit: string
  quantity: number
}

@Component({
  selector: 'app-recipe-table',
  templateUrl: './recipe-table.component.html',
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
  styleUrls: ['./recipe-table.component.scss']
})
export class RecipeTableComponent implements OnInit {
  private backendUrl: string = 'Recipe'
  private url: string = 'recipe'
  public list: Recipe[] = [];
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

  navigateToUpdate(id: number) {
    this.router.navigate([`/${this.url}/update/${id}`]);
  }

  loadPage(page: number, pageSize: number) {
    this.isLoading = true
    this.pageIndex = page
    this.pageSize = pageSize
    this.requestService.getPageable<Recipe>(
      `${environment.apiUrl}/${this.backendUrl}/GetAllPageable?page=${this.pageIndex}&pageSize=${this.pageSize}`
    )
      .subscribe(response => {
          this.list = response.content.content;
          this.totalCount = response.content.totalCount;
          this.isLoading = false;
        }
      );
  }


  delete(allergenId: number, $event: MouseEvent) {
    $event.stopPropagation();
    this.requestService.delete(`${environment.apiUrl}/${this.backendUrl}/Delete/${allergenId}`)
      .subscribe(response => {
        this.loadPage(this.pageIndex, this.pageSize)
      })
  }
}
