// categories.component.ts

import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryArray: Category[] | undefined;
  formStatus: string = 'Add';
  description: string = '';
  categoryForm: FormGroup;
  selectedCategory: any;

  constructor(private categoryService: CategoriesService, private formBuilder: FormBuilder, private notificationService: NotificationService) {
    this.categoryForm = this.formBuilder.group({
      description: ['', Validators.required],
      color: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((items => {
      console.log(items);
      this.categoryArray = items;
    }));
  }

  onSubmit() {
    if (this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.id, this.categoryForm.value.description, this.categoryForm.value.color).then(() => {
        this.notificationService.showSuccess('Category updated successfully', 'Success');
        this.categoryForm.reset();
        this.selectedCategory = null;
        this.formStatus = 'Add';
      }).catch(error => {
        this.notificationService.showError('Error updating category', 'Error');
      });
    } else {
      this.categoryService.addCategory(this.categoryForm.value.description, this.categoryForm.value.color).then(() => {
        this.notificationService.showSuccess('Category added successfully', 'Success');
        this.categoryForm.reset();
      }).catch(error => {
        this.notificationService.showError('Error adding category', 'Error');
      });
    }
  }

  editCategory(category: any) {
    this.formStatus = 'Edit';
    this.selectedCategory = category;
    this.categoryForm.controls['description'].setValue(category.description);
    this.categoryForm.controls['color'].setValue(category.color);
  }

  // Video Version onEdit...
  // onEdit(category, id) {
  //   this.formCategory = category;
  //   this.formStatus = 'Edit';
  //   this.categoryId = id;
  // }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).then(() => {
      this.notificationService.showSuccess('Category deleted successfully', 'Success');
    }).catch(error => {
      this.notificationService.showError('Error deleting category', 'Error');
    });
  }
}
