
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar
  ]
})
export class HomePage implements OnInit {

  activeTab = 'recipes';

  dishname = '';

  newIngredient = '';

  availableIngredients: any[] = [];

  recipes: any[] = [];

  selectedIngredients: any[] = [];

  instructions: string[] = [''];

  constructor(
    private recipeService: RecipeService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadIngredients();
    this.loadRecipes();
  }

  // Load ingredients from database
  loadIngredients() {
    this.recipeService.getIngredients().subscribe({
      next: (data) => {
        this.availableIngredients = data;
      },
      error: (err) => console.error(err)
    });
  }

  // Load recipes
  loadRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
      },
      error: (err) => console.error(err)
    });
  }

  // Change page section
  changeTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'recipes') {
      this.loadRecipes();
    }

    if (tab === 'ingredients') {
      this.loadIngredients();
    }
  }

  // Add new ingredient
  addNewIngredient() {

    if (!this.newIngredient.trim()) {
      this.showToast('Enter an ingredient name.', 'warning');
      return;
    }

    this.recipeService.addIngredient({
      ingredientname: this.newIngredient.trim()
    }).subscribe({
      next: () => {
        this.showToast('Ingredient added!', 'success');
        this.newIngredient = '';
        this.loadIngredients();
      },
      error: (err) => {
        this.showToast(
          err.error?.detail || 'Ingredient already exists.',
          'danger'
        );
      }
    });
  }

  // Add ingredient field
  addIngredient() {
    this.selectedIngredients.push({
      ingredientid: null,
      quantity: 1,
      unit: 'grams'
    });
  }

  removeIngredient(index: number) {
    this.selectedIngredients.splice(index, 1);
  }

  // Add instruction
  addInstruction() {
    this.instructions.push('');
  }

  removeInstruction(index: number) {
    this.instructions.splice(index, 1);
  }

  // Save dish, ingredients and instructions
  saveRecipe() {

    if (!this.dishname.trim()) {
      this.showToast('Enter a dish name.', 'warning');
      return;
    }

    if (
      this.selectedIngredients.length === 0 ||
      this.selectedIngredients.some(
        item => !item.ingredientid || !item.quantity || item.quantity <= 0
      )
    ) {
      this.showToast('Complete your ingredients.', 'warning');
      return;
    }

    const steps = this.instructions.filter(
      step => step.trim() !== ''
    );

    if (steps.length === 0) {
      this.showToast('Add at least one instruction.', 'warning');
      return;
    }

    const data = {
      dishname: this.dishname.trim(),

      ingredients: this.selectedIngredients,

      instructions: steps.map(step => ({
        instruction: step.trim()
      }))
    };

    this.recipeService.addRecipe(data).subscribe({
      next: () => {
        this.showToast('Recipe saved successfully!', 'success');
        this.resetForm();
        this.loadRecipes();
        this.activeTab = 'recipes';
      },
      error: (err) => {
        console.error(err);
        this.showToast(
          err.error?.detail || 'Failed to save recipe.',
          'danger'
        );
      }
    });
  }

  resetForm() {
    this.dishname = '';
    this.selectedIngredients = [];
    this.instructions = [''];
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });

    await toast.present();
  }
}
