import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { every } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.jpg';
  selectedImg: any;
  categoryArray: Category[] | undefined;
  // categories: Array<object>;
  postForm: FormGroup;

  constructor( 
    private categoryService: CategoriesService, 
    private fb: FormBuilder, 
    private postService: PostsService,
    private route: ActivatedRoute ) {

      this.route.queryParams.subscribe(val => {
        this.postService.loadOneData(val['id']).subscribe(post => {
          console.log(post)
        })
      })

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: ['', Validators.required]
    })
    if (this.postForm && this.postForm.get('permalink')) {
      this.postForm.get('permalink')!.disable();
    }
  
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categoryArray = val;
      // this.categories = val;
    })
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged($event: any) {
    
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result
    }

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    // const permalink2 = this.postForm.get('permalink')?.value;
    // console.log(permalink2);
    // console.log(this.postForm.controls['permalink'].value);
    let splitted = this.postForm.value.category.split('-');    

    const postData: Post = {
      id: '',
      title: this.postForm.value.title,
      permalink: this.postForm.get('permalink')?.value,
      category: {
        categoryId: splitted[0],
        categoryDescription: splitted[1],
        categoryColor: splitted[2],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    }
    console.log('--------------')
    console.log(postData);
    console.log('--------------')

    this.postService.uploadImage(this.selectedImg, postData);
    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.jpg';
  }
}
