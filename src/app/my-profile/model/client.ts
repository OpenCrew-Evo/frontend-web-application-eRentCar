export interface Client {
  id: number;
  names: string;
  lastNames: string;
  address: string;
  cellphoneNumber: number;
  averageResponsibility: number;
  responseTime: number;
  rate: number;
  imagePath: string;
  planId: number;
  cars: any[];
  favourites: any[];
  rents: any[];
  userId: number;
}
