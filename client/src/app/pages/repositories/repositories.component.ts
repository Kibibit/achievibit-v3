import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'kb-repositories',
  standalone: true,
  imports: [ RouterModule ],
  templateUrl: './repositories.component.html',
  styleUrl: './repositories.component.scss'
})
export class RepositoriesComponent {
}
