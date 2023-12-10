import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage, private firestore: AngularFirestore,
    private toastr: ToastrService, private router: Router) { }

  uploadImage(selectedImage: any, postData: Post, formStatus: string | undefined, id: undefined) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('post image uploaded successfully');

      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImgPath = URL;
        console.log(postData);

        if(formStatus == 'Edit') {
          this.updateData(id, postData)
        } else {
          this.saveData(postData);
        }
      })
    })
  }

  saveData(postData: unknown) {
    this.firestore.collection('posts').add(postData).then(docRef => {
      this.toastr.success('Data Insert Successfully');
      this.router.navigate(['/posts']);
    });
  }

  loadData() {
    return this.firestore.collection('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as {
            title: string,
            permalink: string,
            category: {
              categoryId: string,
              categoryDescription: string,
              categoryColor: string
            }
            postImgPath: string,
            excerpt: string,
            content: string,
            isFeatured: boolean,
            views: number,
            status: string,
            //fetch createdAt timestamp from firebase
            createdAt: any         
          };
          const createdAt = data.createdAt.toDate();
          const id = a.payload.doc.id;
          return {
            id,
            title: data.title,
            postImgPath: data.postImgPath,
            excerpt: data.excerpt,
            category: data.category.categoryDescription,
            createdAt: createdAt
          } as unknown as Post;
        })
      })
    );
  }

  loadOneData(id: string | undefined) {
    return this.firestore.doc(`posts/${id}`).valueChanges();
  }

  updateData(id: any, postData: any) {
    this.firestore.doc(`posts/${id}`).update(postData).then(() => {
      this.toastr.success('Data Updated Successfully');
      this.router.navigate(['/posts']);
    })
  }

  deleteImage(postImgPath: string, id: any) {
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.deleteData(id);
    })
  }

  deleteData(id: any) {
    this.firestore.doc(`posts/${id}`).delete().then(() => {
      this.toastr.warning('Data Deleted ..!');
    })
  }

  markFeatured(id: any, featuredData: any) {
    this.firestore.doc(`posts/${id}`).update(featuredData).then(() => {
      this.toastr.info('Featured Status Updated');
    })
  }
}
