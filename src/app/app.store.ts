import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, exhaustMap } from 'rxjs';
import { UserDetails } from 'src/app/app.model';

const defaultAppState: UserState = {
  userDetails: [],
};

export interface UserState {
  userDetails: Array<UserDetails>;
}

@Injectable()
export class AppStore extends ComponentStore<UserState> {
  private httpClient = inject(HttpClient);

  constructor() {
    super(defaultAppState);
  }

  public getUserDetails = this.effect(_ =>
    _.pipe(
      exhaustMap(_ =>
        this._fetchUserDetails().pipe(
          tapResponse(
            userDetails => this._setUserDetails(userDetails),
            (error: HttpErrorResponse) => alert(error.message)
          )
        )
      )
    )
  );

  public readonly userDetails$ = this.select(state => state.userDetails);

  private _setUserDetails = this.updater(
    (state, userDetails: UserDetails[]) => ({
      ...state,
      userDetails,
    })
  );

  private _fetchUserDetails(): Observable<UserDetails[]> {
    return this.httpClient.get<UserDetails[]>(
      'https://jsonplaceholder.typicode.com/posts'
    );
  }
}
