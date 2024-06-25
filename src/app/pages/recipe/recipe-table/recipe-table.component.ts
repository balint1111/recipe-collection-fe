import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {environment} from "../../../environment";
import {
  NzTableComponent,
  NzTableSortFn,
  NzTableSortOrder,
  NzThAddOnComponent, NzTheadComponent,
  NzThMeasureDirective
} from "ng-zorro-antd/table";
import {NzPaginationComponent, NzPaginationDefaultComponent} from "ng-zorro-antd/pagination";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective, NzIconModule} from "ng-zorro-antd/icon";
import {Material} from "../../material/material-table/material-table.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzSwitchComponent} from "ng-zorro-antd/switch";
import {debounceTime, distinctUntilChanged, fromEvent, map} from "rxjs";

export interface Recipe {
  id: number
  code: string
  name: string
  description: string
  ingredientGroups: IngredientGroup[]
  preparationDuration: number
  cookingDuration: number
  totalDuration: number
  isFavorite: boolean
  imgBase64: string
}

export interface IngredientGroup {
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

class ColumnItem {
  public name: string;
  public dbName: string;
  public style: string;
  public sortOrder: NzTableSortOrder | null;
  public sortDirections: NzTableSortOrder[];

  constructor(
    name: string,
    dbName: string,
    style: string,
    sortOrder: NzTableSortOrder | null,
    sortDirections: NzTableSortOrder[],
  ) {
    this.name = name
    this.dbName = dbName
    this.style = style
    this.sortOrder = sortOrder
    this.sortDirections = sortDirections
  }
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
    NzIconDirective,
    NzThAddOnComponent,
    AsyncPipe,
    NgIf,
    NzInputDirective,
    NzSwitchComponent,
  ],
  styleUrls: ['./recipe-table.component.scss']
})
export class RecipeTableComponent implements OnInit, AfterViewInit {
  @ViewChild('basicTable', {static: true}) basicTable: NzTableComponent<any> | undefined;
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  listOfColumns: ColumnItem[] = [
    new ColumnItem(
      'Id',
      'Id',
      "width: 20%",
      null,
      ['ascend', 'descend', null],
    ),
    new ColumnItem(
      'Kód',
      'code',
      "width: 20%",
      null,
      ['ascend', 'descend', null],
    ),
    new ColumnItem(
      'Név',
      'Name',
      "width: 20%",
      null,
      ['ascend', 'descend', null],
    ),
    new ColumnItem(
      'Leírás',
      'Description',
      "width: 20%",
      null,
      ['ascend', 'descend', null],
    ),

  ]


  private backendUrl: string = 'Recipe'
  private url: string = 'recipe'
  public list: Recipe[] = [];
  public isLoading = true;
  public pageIndex = 1;
  public pageSize = 10;
  public totalCount = 0;
  public sortField: string | null = null;
  public sortDirection: string | null = null;
  public search: string = "";

  constructor(
    private requestService: RequestService,
    private router: Router,
    private modal: NzModalService,
  ) {

  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput?.nativeElement as HTMLInputElement, 'input')
      .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(300))
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        this.search = value
        this.loadPage(this.pageIndex, this.pageSize)
      })
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

  trackByName(_:number, item: ColumnItem): string {
    return item.dbName;
  }

  sortChange(dbName: string, direction: string | null, item: ColumnItem) {
    this.setSort(dbName, direction)
    // this.basicTable..sort(this.myTable.sortColumnKey, this.myTable.sortOrder);
  }

  setSort(dbName: string, direction: string | null,): void {
    this.listOfColumns.forEach(item => {
      if (item.dbName === dbName) {
        item.sortOrder = direction;
      } else {
        item.sortOrder = null;
      }
    });
    if (direction == "ascend") {
      this.sortDirection = "ASC";
    } else if (direction == "descend") {
      this.sortDirection = "DESC";
    } else if (direction == null) {
      this.sortDirection = null;
    }
    this.sortField = dbName;
    this.loadPage(this.pageIndex, this.pageSize)
  }

  loadPage(page: number, pageSize: number) {
    this.isLoading = true
    this.pageIndex = page
    this.pageSize = pageSize
    let sort = (this.sortField != null && this.sortDirection != null) ?
      `&sortField=${this.sortField}&sortDirection=${this.sortDirection}` : ""
    this.requestService.getPageable<Recipe>(
      `${environment.apiUrl}/${this.backendUrl}/GetAllPageable?page=${this.pageIndex}&pageSize=${this.pageSize}&justOwn=true&filter=${this.search}${sort}`
    ).subscribe(response => {
        this.list = response.content.content;
        this.totalCount = response.content.totalCount;
        this.isLoading = false;
      }
    );
  }


  delete(allergenId: number) {
    this.requestService.delete(`${environment.apiUrl}/${this.backendUrl}/Delete/${allergenId}`)
      .subscribe(response => {
        this.loadPage(this.pageIndex, this.pageSize)
      })
  }

  showDeleteConfirm(index: number, $event: MouseEvent): void {
    $event.stopPropagation();
    this.modal.confirm({
      nzTitle: 'Biztos vagy benne, hogy törölni akarod ezt a receptet?',
      nzContent: 'Ezt a műveletet nem lehet visszavonni',
      nzCancelText: "Mégse",
      nzOkText: "OK",
      nzWidth: 600,
      nzCentered: true,
      nzOnOk: () => this.delete(index)
    });
  }

}
