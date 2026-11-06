
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private api = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Get all ingredients
  getIngredients() {
    return this.http.get<any[]>(
      `${this.api}/ingredients`
    );
  }

  // Add ingredient
  addIngredient(data: any) {
    return this.http.post(
      `${this.api}/ingredients`,
      data
    );
  }

  // Save recipe
  addRecipe(data: any) {
    return this.http.post(
      `${this.api}/recipes`,
      data
    );
  }

  // Get all recipes
  getRecipes() {
    return this.http.get<any[]>(
      `${this.api}/recipes`
    );
  }
}
