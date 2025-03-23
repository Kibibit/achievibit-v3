import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'kb-users',
  standalone: true,
  imports: [ RouterModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {}
