import {
  DisplayProperty,
  UserDetails,
  DisplayProperties,
  UserState,
} from 'src/app/app.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, exhaustMap, tap, withLatestFrom } from 'rxjs';

const defaultAppState: UserState = {
  userDetails: [],
  displayProperties: [],
  activeSquareIndex: -1,
  activeUserId: null,
};

@Injectable()
export class AppStore extends ComponentStore<UserState> {
  private httpClient = inject(HttpClient);

  private currentActiveUserIndexProperty = 0;

  private readonly defaultDisplayProperty: DisplayProperty = 'title';

  private readonly displayProperties: Array<DisplayProperty> = [
    'title',
    'body',
    'id',
    'userId',
  ];

  constructor() {
    super(defaultAppState);
  }

  private setActiveSquareIndex = this.updater(
    (state, activeSquareIndex: number) => ({
      ...state,
      activeSquareIndex,
    })
  );

  private updateActiveUserId = this.updater(
    (state, activeUserId: number | null) => ({
      ...state,
      activeUserId,
    })
  );

  private selectActiveUserId = this.select(state => state.activeUserId);

  // create a copy of the userDetails to show default display properties
  private setDisplayProperties = this.updater(
    (state, userDetails: Array<UserDetails>) => {
      const displayProperties: Array<DisplayProperties> = userDetails.map(
        user => ({
          property: this.defaultDisplayProperty,
          value: user.title,
        })
      );
      return {
        ...state,
        displayProperties,
      };
    }
  );

  private setUserDetails = this.updater(
    (state, userDetails: UserDetails[]) => ({
      ...state,
      userDetails,
    })
  );

  //update a specific display property based on the index and property to be displayed
  private updateSpecificDisplayPropertiesByIndex = this.updater(
    (state, details: { newDetails: DisplayProperties; index: number }) => {
      state.displayProperties[details.index] = details.newDetails;
      return {
        ...state,
      };
    }
  );

  private selectActiveSquareIndex$ = this.select(
    state => state.activeSquareIndex
  );

  private selectUserDetails$ = this.select(state => state.userDetails);

  private selectDisplayProperties$ = this.select(
    state => state.displayProperties
  );

  //toggle through the next property to be displayed
  private toggleDisplayProperty(): DisplayProperty {
    this.currentActiveUserIndexProperty =
      (this.currentActiveUserIndexProperty + 1) % this.displayProperties.length;

    return this.displayProperties[this.currentActiveUserIndexProperty];
  }

  public readonly getAppState$ = this.select(state => state);

  public readonly appViewModel$ = this.select(
    this.selectActiveSquareIndex$,
    this.selectDisplayProperties$,
    this.selectActiveUserId,
    (activeSquareIndex, displayProperties, activeUserId) => ({
      activeSquareIndex,
      displayProperties,
      activeUserId,
    })
  );

  public handleSquareClick = this.effect((index$: Observable<number>) =>
    index$.pipe(
      withLatestFrom(
        this.selectUserDetails$,
        this.selectActiveSquareIndex$,
        this.selectDisplayProperties$
      ),
      tap(([index, userDetails, activeIndex]) => {
        const currentSquareIndex = activeIndex === -1 ? index : activeIndex;
        this.setActiveSquareIndex(index);

        let nextDisplayProperty = this.toggleDisplayProperty();

        if (currentSquareIndex !== index) {
          // reset existing square index
          this.updateSpecificDisplayPropertiesByIndex({
            newDetails: {
              property: this.defaultDisplayProperty,
              value:
                userDetails[currentSquareIndex][
                  this.defaultDisplayProperty
                ]?.toString() || '',
            },
            index: currentSquareIndex,
          });

          // reset display toggle
          this.currentActiveUserIndexProperty = 0;
          nextDisplayProperty = this.toggleDisplayProperty();
        }

        this.updateSpecificDisplayPropertiesByIndex({
          newDetails: {
            property: nextDisplayProperty,
            value: userDetails[index][nextDisplayProperty]?.toString() || '',
          },
          index,
        });

        this.updateActiveUserId(userDetails[index].id);
      })
    )
  );

  public getUserDetails = this.effect(_ =>
    _.pipe(
      exhaustMap(_ =>
        this.fetchUserDetails().pipe(
          tapResponse(
            userDetails => {
              this.setUserDetails(userDetails);
              this.setDisplayProperties(userDetails);
            },
            (error: HttpErrorResponse) => alert(error.message)
          )
        )
      )
    )
  );

  private fetchUserDetails(): Observable<UserDetails[]> {
    return this.httpClient.get<UserDetails[]>(
      'https://jsonplaceholder.typicode.com/posts'
    );
  }
}
