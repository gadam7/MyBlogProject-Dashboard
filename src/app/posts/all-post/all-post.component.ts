import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {

  postArray: Post[] | undefined;

  constructor( private postService: PostsService, private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.postService.loadData().subscribe(items => {
      this.postArray = items;
    });
  }

  onDelete(postImgPath: string, id: any) {
    this.postService.deleteImage(postImgPath, id);
  }

  onFeatured(id: any, value: any) {
    console.log(`onFeatured called with id: ${id}, value: ${value}`);
    const featuredData = {
      isFeatured: value
    }

    this.postService.markFeatured(id, featuredData);
  }
  // onFeatured(id: any, value: boolean): void {
  //   console.log(`onFeatured called with id: ${id}, value: ${value}`);
    
  //   // Check if value is undefined
  //   if (value === undefined) {
  //   value = false; // Set a default value
  //   }
    
  //   // Toggle the value
  //   const newValue = !value;
    
  //   const featuredData = {
  //   isFeatured: newValue
  //   }
   
  //   this.postService.markFeatured(id, featuredData);
  //   this.cdr.detectChanges(); // Manually trigger change detection
  // }
}
