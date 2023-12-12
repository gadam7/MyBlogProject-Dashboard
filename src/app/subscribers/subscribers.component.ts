import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';
import { Sub } from '../models/sub';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {

  subscribersArray: Sub[] | undefined;

  constructor( private subService: SubscribersService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subService.loadData().subscribe(items => {
      this.subscribersArray = items;
    })
  }

  onDelete(id: string) {
    this.subService.deleteData(id).then(() => {
      this.notificationService.showSuccess('Subscriber deleted successfully', 'Success');
    }).catch(error => {
      this.notificationService.showError('Error deleting subscriber', 'Error');
    });
  }

}
