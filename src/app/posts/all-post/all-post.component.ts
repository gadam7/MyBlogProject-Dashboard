import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {

  postArray: Post[] | undefined;

  constructor( private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.loadData().subscribe(items => {
      console.log(items);
      this.postArray = items;
    });
  }
}
