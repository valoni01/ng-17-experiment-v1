import { Component, Input } from '@angular/core';
import { UserDetails } from 'src/app/app.model';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  @Input({ required: true }) user!: UserDetails;
}
