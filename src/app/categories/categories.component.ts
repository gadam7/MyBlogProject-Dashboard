// categories.component.ts

import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryArray: Category[] | undefined;
  formCategory: string | undefined;
  formStatus: string = 'Add';
  categoryId: string | undefined;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val: Category[]) => {
      console.log(val);
      this.categoryArray = val;
    });
  }

  // onSubmit(formData: { reset(): unknown; value: { category: any; }; }) {
  //   const categoryData = {
  //     data: {
  //       category: formData.value.category,
  //     },
  //   } as Category;
  
  //   if (this.formStatus == 'Add') {
  //     this.categoryService.saveData(categoryData);
  //     formData.reset();
  //   } else if (this.formStatus == 'Edit') {
  //     this.categoryService.updateData(this.categoryId || '', categoryData.data);
  //     // Reset the form or perform any additional logic as needed
  //   }
  // }

  onSubmit(formData: { reset(): unknown; value: { category: any; }; }) {
    const categoryData = {
      data: {
        category: formData.value.category,
      },
    } as Category;
  
    if (this.formStatus === 'Add') {
      this.categoryService.saveData(categoryData);
      formData.reset();
    } else if (this.formStatus === 'Edit') {
      this.categoryService.updateData(this.categoryId || '', categoryData.data);
      // Reset the form or perform any additional logic as needed
    }
  }
  
  onEdit(category: Category, categoryId: string) {
    console.log(categoryId);
    console.log(category);
    this.formCategory = category.data.category;
    this.formStatus = 'Edit';
    this.categoryId = categoryId; // Store the categoryId for later use
  }
}
