import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Sub } from '../models/sub';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor( private firestore: AngularFirestore, private toastr: ToastrService ) { }

  loadData() {
    return this.firestore.collection('subscribers').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as { name: string, email: string };
          const id = a.payload.doc.id;
          return { id, name: data.name, email: data.email} as Sub;
        })
      })
    );
  }

  deleteData (id: string) {
    // this.firestore.doc(`subscribers/${id}`).delete().then(docRef => {
    //   this.toastr.success('Subscriber Deleted..!');
    // })
    return this.firestore.collection('subscribers').doc(id).delete();
  }
}
