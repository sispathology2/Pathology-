export interface Test {
  id: string;
  name: string;
  category: string;
  mrp: number;
  offerPrice: number;
  description: string;
  fastingRequired: boolean;
  homeCollection: boolean;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  isBestValue: boolean;
  tests: string[];
  description: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'test' | 'package';
}

export interface BookingDetails {
  fullName: string;
  mobile: string;
  address: string;
  gender: string;
  age: string;
  preferredDate: string;
  preferredTime: string;
  homeCollection: boolean;
  fasting: boolean;
  specialNote: string;
}
