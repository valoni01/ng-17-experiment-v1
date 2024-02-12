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

export type DisplayProperty = keyof UserDetails;
