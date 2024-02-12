import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  DisplayProperties,
  DisplayProperty,
  UserDetails,
} from 'src/app/app.model';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  @Input({ required: true }) displayedProperty!: DisplayProperties;
}
