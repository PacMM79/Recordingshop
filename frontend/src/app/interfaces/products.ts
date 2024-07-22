export interface Products {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
    offer?: {
      number: number;
      percent: number;
    };
    discountPercent?: number;
  }