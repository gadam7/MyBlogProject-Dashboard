import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor( 
    private storage: AngularFireStorage, private firestore: AngularFirestore, 
    private toastr: ToastrService, private router: Router ) { }

  uploadImage(selectedImage: any, postData: Post) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('post image uploaded successfully');
      
      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImgPath = URL;
        console.log(postData);

        this.saveData(postData);
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
            createdAt: Date };
          const id = a.payload.doc.id;
          return { 
            id, 
            title: data.title, 
            postImgPath: data.postImgPath, 
            excerpt: data.excerpt, 
            category: data.category.categoryDescription,
            createdAt: data.createdAt  
          } as unknown as Post;
        })
      })
    );
  }

  loadOneData(id: string | undefined) {
    return this.firestore.doc(`posts/${id}`).valueChanges();
  }
}
