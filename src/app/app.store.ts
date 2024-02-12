import { DisplayProperty, UserDetails, DisplayProperties } from './app.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, exhaustMap, tap, withLatestFrom } from 'rxjs';

const defaultAppState: UserState = {
  userDetails: [],
  displayProperties: [],
  activeSquareIndex: -1,
  displayedValue: '',
  activeUserId: null,
};

export interface UserState {
  userDetails: Array<UserDetails>;
  displayProperties: Array<DisplayProperties>;
  displayedValue: string | number;
  activeSquareIndex: number;
  activeUserId: number | null;
}

@Injectable()
export class AppStore extends ComponentStore<UserState> {
  private httpClient = inject(HttpClient);
  private readonly _displayProperties: Array<DisplayProperty> = [
    'title',
    'body',
    'id',
    'userId',
  ];
  private readonly _defaultDisplayProperty: DisplayProperty = 'title';

  private _currentActiveUserIndexProperty = 0;

  constructor() {
    super(defaultAppState);
  }

  public updateActiveSquareIndex = this.updater(
    (state, activeSquareIndex: number) => ({
      ...state,
      activeSquareIndex,
    })
  );

  public setActiveSquareIndex = this.updater(
    (state, activeSquareIndex: number) => ({
      ...state,
      activeSquareIndex,
    })
  );

  public selectActiveSquareIndex$ = this.select(
    state => state.activeSquareIndex
  );

  public setDisplayProperty = this.updater(
    (state, displayedProperty: DisplayProperty) => ({
      ...state,
      displayedProperty,
    })
  );

  public selectUserDetails$ = this.select(state => state.userDetails);
  public selectDisplayedProperties$ = this.select(
    state => state.displayProperties
  );

  public selectDisplayProperties$ = this.select(
    state => state.displayProperties
  );

  public updateDisplayedProperty = this.updater(
    (state, displayedProperty: DisplayProperty) => ({
      ...state,
      displayedProperty,
    })
  );

  public toggleDisplayProperty(): DisplayProperty {
    this._currentActiveUserIndexProperty =
      (this._currentActiveUserIndexProperty + 1) %
      this._displayProperties.length;

    return this._displayProperties[this._currentActiveUserIndexProperty];
  }

  private updateSpecificDisplayPropertiesByIndex = this.updater(
    (state, details: { newDetails: DisplayProperties; index: number }) => {
      state.displayProperties[details.index] = details.newDetails;
      return {
        ...state,
      };
    }
  );

  private _updateActiveUserId = this.updater(
    (state, activeUserId: number | null) => ({
      ...state,
      activeUserId,
    })
  );

  public onSquareClicked(index: number) {
    this.kaboom$(index);
  }

  public kaboom$ = this.effect((index$: Observable<number>) =>
    index$.pipe(
      withLatestFrom(
        this.selectUserDetails$,
        this.selectActiveSquareIndex$,
        this.selectDisplayedProperties$
      ),
      tap(([index, userDetails, activeIndex]) => {
        const currentSquareIndex = activeIndex === -1 ? index : activeIndex;
        this.setActiveSquareIndex(index);

        let nextDisplayProperty = this.toggleDisplayProperty();

        if (currentSquareIndex !== index) {
          //reset existing square index
          this.updateSpecificDisplayPropertiesByIndex({
            newDetails: {
              property: this._defaultDisplayProperty,
              value:
                userDetails[currentSquareIndex][
                  this._defaultDisplayProperty
                ]?.toString() || '',
            },
            index: currentSquareIndex,
          });

          //reset display toggle
          this._currentActiveUserIndexProperty = 0;
          nextDisplayProperty = this.toggleDisplayProperty();
        }

        this.updateSpecificDisplayPropertiesByIndex({
          newDetails: {
            property: nextDisplayProperty,
            value: userDetails[index][nextDisplayProperty]?.toString() || '',
          },
          index,
        });

        this._updateActiveUserId(userDetails[index]['id']);
      })
    )
  );

  public fetchUserDetails = this.effect(_ =>
    _.pipe(
      exhaustMap(_ =>
        this._fetchUserDetails().pipe(
          tapResponse(
            userDetails => {
              this._setUserDetails(userDetails);
              this._setDisplayProperties(userDetails);
            },
            (error: HttpErrorResponse) => alert(error.message)
          )
        )
      )
    )
  );

  //create a copy of the userDetails to show default display properties
  private readonly _setDisplayProperties = this.updater(
    (state, userDetails: Array<UserDetails>) => {
      const displayProperties: Array<DisplayProperties> = userDetails.map(
        user => ({
          property: this._defaultDisplayProperty,
          value: user.title,
        })
      );
      return {
        ...state,
        displayProperties,
      };
    }
  );

  public readonly getAppState$ = this.select(state => state);

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
