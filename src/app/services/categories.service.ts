// categories.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private firestore: AngularFirestore) { }

  addCategory(description: string, color: string) {
    return this.firestore.collection('categories').add({ description, color });
  }

  loadData() {
    return this.firestore.collection('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as { description: string, color: string };
          const id = a.payload.doc.id;
          return { id, description: data.description, color: data.color} as Category;
        })
      })
    );
  }

  updateCategory(id: string, description: string, color: string) {
    return this.firestore.collection('categories').doc(id).update({ description, color });
  }

  // Video Version updateData
  // updateCategory(id: string, description: string, color: string) {
  //   this.firestore.doc(`categories/${id}`).update({ description, color });
  // }

  deleteCategory(id: string) {
    return this.firestore.collection('categories').doc(id).delete();
  }

  // Video Version deleteData
  // deleteCategory(id: string) {
  //   this.firestore.doc(`categories/${id}`).delete();
  // }
}
