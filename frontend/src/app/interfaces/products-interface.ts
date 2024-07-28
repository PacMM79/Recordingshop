export interface Products {
  id: number;
  name: string;
  price: number; // Asegúrate de que price sea un número
  thumbnail: string;
  quantity: number;
  currency?: string; // Agregamos la moneda
  offer?: {
    number: number;
    percent: number;
  };
  discountPercent?: number;
}
