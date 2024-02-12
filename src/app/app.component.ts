import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SquareComponent } from 'src/app/ui-components/square/square.component';
import { AppStore } from 'src/app/app.store';
import { LetDirective } from '@ngrx/component';
import { HeaderComponent } from 'src/app/ui-components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SquareComponent,
    LetDirective,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppStore],
})
export class AppComponent implements OnInit {
  private appStore = inject(AppStore);

  public appState$ = this.appStore.appViewModel$;

  public ngOnInit(): void {
    this.appStore.getUserDetails();
  }

  public onSquareClicked(index: number): void {
    this.appStore.handleSquareClick(index);
  }
}
