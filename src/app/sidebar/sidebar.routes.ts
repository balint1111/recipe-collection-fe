import {Routes} from '@angular/router';
import {WelcomeComponent} from "../pages/welcome/welcome.component";
import {AllergenTableComponent} from "../pages/allergen/allergen-table/allergen-table.component";
import {CreateAllergenComponent} from "../pages/allergen/create-allergen/create-allergen.component";
import {
  MaterialCategoryTableComponent
} from "../pages/material-category/material-category-table/material-category-table.component";
import {
  CreateMaterialCategoryComponent
} from "../pages/material-category/create-material-category/create-material-category.component";
import {MaterialTableComponent} from "../pages/material/material-table/material-table.component";
import {CreateMaterialComponent} from "../pages/material/material-create/create-material.component";
import {RecipeTableComponent} from "../pages/recipe/recipe-table/recipe-table.component";
import {CreateRecipeComponent} from "../pages/recipe/recipe-create/create-recipe.component";

export const SIDEBAR_ROUTES: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'allergens', component: AllergenTableComponent },
  { path: 'allergens/create', component: CreateAllergenComponent },
  { path: 'material-category', component: MaterialCategoryTableComponent },
  { path: 'material-category/create', component: CreateMaterialCategoryComponent },
  { path: 'material', component: MaterialTableComponent },
  { path: 'material/create', component: CreateMaterialComponent },
  { path: 'recipe', component: RecipeTableComponent },
  { path: 'recipe/create', component: CreateRecipeComponent },
  { path: 'recipe/update/:id', component: CreateRecipeComponent },
];
