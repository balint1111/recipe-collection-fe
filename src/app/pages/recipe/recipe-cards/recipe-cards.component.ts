import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {NzListComponent, NzListItemComponent, NzListItemMetaComponent} from "ng-zorro-antd/list";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzCardComponent, NzCardMetaComponent} from "ng-zorro-antd/card";
import {RequestService} from "../../../service/request.service";
import {
  environment,
  fallbackImg,
  IngredientGMapToAllergensPipe,
  IngredientGMapToMaterialsPipe
} from "../../../environment";
import {Recipe} from "../recipe-table/recipe-table.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzTableComponent} from "ng-zorro-antd/table";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {AuthService} from "../../../service/auth.service";
import {NzSwitchComponent} from "ng-zorro-antd/switch";

class ChangeHelper {
  search: string;
  justFavorites: boolean;

  constructor(search: string, justFavorites: boolean) {
    this.search = search
    this.justFavorites = justFavorites
  }
}

@Component({
  selector: 'app-recipe-cards',
  templateUrl: './recipe-cards.component.html',
  styleUrls: ['./recipe-cards.component.scss'],
  standalone: true,
  imports: [
    NzListComponent,
    NzListItemComponent,
    NzSkeletonComponent,
    NzListItemMetaComponent,
    NgIf,
    CdkVirtualForOf,
    NzRowDirective,
    NzColDirective,
    NzCardComponent,
    NzCardMetaComponent,
    IngredientGMapToAllergensPipe,
    NgForOf,
    NgOptimizedImage,
    FormsModule,
    NzInputDirective,
    ReactiveFormsModule,
    NzTableComponent,
    IngredientGMapToAllergensPipe,
    IngredientGMapToMaterialsPipe,
    NzIconDirective,
    AsyncPipe,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    NzSwitchComponent
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RecipeCardsComponent implements OnInit, OnDestroy, AfterViewInit {
  private backendUrl: string = 'Recipe'
  paramChange = new BehaviorSubject<ChangeHelper>(new ChangeHelper("", false))
  ds: MyDataSource = new MyDataSource(this.requestService, this.paramChange.asObservable())
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  @ViewChild('justFavoritesToggle') justFavoritesToggle: ElementRef | undefined;
  isLoggedIn$?: Observable<boolean | undefined>;
  justFavorites = false;
  search: string = "";

  ngAfterViewInit(): void {
    let asffg=fromEvent(this.searchInput?.nativeElement as HTMLInputElement, 'input')
    asffg.pipe(map((event: Event) => (event.target as HTMLInputElement).value))
    fromEvent(this.searchInput?.nativeElement as HTMLInputElement, 'input')
      .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(300))
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        this.search = value
        this.paramChange.next(new ChangeHelper(this.search, this.justFavorites))
      })
  }

  private destroy$ = new Subject();

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  ngOnDestroy(): void {
    this.destroy$.next(this);
    this.destroy$.complete();
  }

  clickSwitch(): void {
    this.paramChange.next(new ChangeHelper(this.search, !this.justFavorites))
  }

  toggleFavorite(recipe: Recipe, $event: MouseEvent) {
    if (!recipe.isFavorite) {
      this.requestService.post(`${environment.apiUrl}/${this.backendUrl}/AddFavorite?recipeId=${recipe.id}`)
        .subscribe(response => {
          recipe.isFavorite = !recipe.isFavorite
        })
    } else {
      this.requestService.delete(`${environment.apiUrl}/${this.backendUrl}/DeleteFavorite?recipeId=${recipe.id}`)
        .subscribe(response => {
          recipe.isFavorite = !recipe.isFavorite
        })
    }
  }

  protected readonly fallbackImg = fallbackImg;
}

class MyDataSource extends DataSource<Recipe> {
  private backendUrl: string = 'Recipe'
  private filter: string = ''
  justFavorites = false;
  private pageSize = 10;
  public cachedData: Recipe[] = [];
  private serverResponseData: Recipe[] = [];
  private fetchedPages = new Set<number>();
  public dataStream = new BehaviorSubject<Recipe[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();

  constructor(private requestService: RequestService, filterObservable: Observable<ChangeHelper>) {
    super();
    filterObservable
      .subscribe((data) => {
          this.pageSize = 10;
          this.cachedData = [];
          this.serverResponseData = [];
          this.fetchedPages = new Set<number>();
          this.filter = data.search;
          this.justFavorites = data.justFavorites;
          this.fetchPage(1);
        }
      )
  }

  connect(collectionViewer: CollectionViewer): Observable<Recipe[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(1);
    collectionViewer.viewChange
      .pipe(
        // takeUntil(this.complete$),
        takeUntil(this.disconnect$)
      )
      .subscribe(range => {
        if (this.serverResponseData.length > 0) {
          const endPage = this.getPageForIndex(range.end);
          this.fetchPage(endPage + 1);
        } else {
          this.complete$.next();
          this.complete$.complete();
        }
      });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.requestService.getPageable<Recipe>(
      `${environment.apiUrl}/${this.backendUrl}/GetAllPageable?page=${page}&pageSize=${this.pageSize}&filter=${this.filter}&justFavorites=${this.justFavorites}`
    ).subscribe(res => {
        this.serverResponseData = res.content.content
        this.cachedData.splice(
          page * this.pageSize,
          this.pageSize,
          ...res.content.content
        );
        this.dataStream.next(this.cachedData)
      }
    );
  }
}


