import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SquareComponent } from 'src/app/ui-components/square/square.component';
import { AppStore } from 'src/app/app.store';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SquareComponent, LetDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppStore],
})
export class AppComponent implements OnInit {
  private appStore = inject(AppStore);

  public appState$ = this.appStore.getAppState$;

  public ngOnInit(): void {
    this.appStore.fetchUserDetails();
  }

  public onSquareClicked(index: number): void {
    this.appStore.onSquareClicked(index);
  }
}
