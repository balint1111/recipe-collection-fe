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
import {RecipeCardsComponent} from "../pages/recipe/recipe-cards/recipe-cards.component";
import {LoginComponent} from "../login/login.component";
import {authGuard} from "../../AuthGuard";
import {RegistrationComponent} from "../registration/registration.component";

export const SIDEBAR_ROUTES: Routes = [
  { path: '', component: RecipeCardsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'allergens', component: AllergenTableComponent, canActivate: [authGuard()]  },
  { path: 'allergens/create', component: CreateAllergenComponent, canActivate: [authGuard()]  },
  { path: 'allergens/update/:id', component: CreateAllergenComponent, canActivate: [authGuard()]  },
  { path: 'material-category', component: MaterialCategoryTableComponent, canActivate: [authGuard()]  },
  { path: 'material-category/create', component: CreateMaterialCategoryComponent, canActivate: [authGuard()]  },
  { path: 'material-category/update/:id', component: CreateMaterialCategoryComponent, canActivate: [authGuard()]  },
  { path: 'material', component: MaterialTableComponent, canActivate: [authGuard()]  },
  { path: 'material/create', component: CreateMaterialComponent, canActivate: [authGuard()]  },
  { path: 'material/update/:id', component: CreateMaterialComponent, canActivate: [authGuard()]  },
  { path: 'recipe', component: RecipeTableComponent, canActivate: [authGuard()]  },
  { path: 'recipe/create', component: CreateRecipeComponent, canActivate: [authGuard()]  },
  { path: 'recipe/update/:id', component: CreateRecipeComponent, canActivate: [authGuard()]  },
];
