import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userEmail: string | undefined;
  isLoggedIn$: Observable<boolean> | undefined

  constructor( private authService: AuthService ) {}

  ngOnInit(): void {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (user && user.email) {
          this.userEmail = user.email;
        } else {
          console.error('Invalid user data structure in localStorage');
        }
      } else {
        console.error('User data not found in localStorage');
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }

    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  onLogOut() {
    this.authService.logOut();
  }
}
