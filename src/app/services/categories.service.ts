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

  constructor(private afs: AngularFirestore, private toastr: ToastrService) { }

  saveData(data: Category) {
    this.afs.collection('categories').add(data).then(docRef => {
      console.log(docRef);
      this.toastr.success('Data Inserted Successfully ..!');
    })
    .catch(err => { console.log(err); });
  }

  loadData(): Observable<Category[]> {
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, category  };
        });
      })
    );
  }

  updateData(categoryId: string, newData: Partial<Category['data']>) {
    this.afs.collection('categories').doc(categoryId).update({ data: newData })
      .then(() => {
        console.log('Document successfully updated!');
        this.toastr.success('Data Updated Successfully ..!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        this.toastr.error('Failed to update data.');
      });
  }
}
