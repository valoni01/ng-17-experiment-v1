export interface UserDetails {
  userId: string | null;
  id: number | null;
  title: string;
  body: string;
}

export interface DisplayProperties {
  property: DisplayProperty;
  value: string;
}

export interface UserState {
  userDetails: Array<UserDetails>;
  displayProperties: Array<DisplayProperties>;
  activeSquareIndex: number;
  activeUserId: number | null;
}

export type DisplayProperty = keyof UserDetails;
