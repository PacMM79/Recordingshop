export interface Products {
  id: number;
  name: string;
  price: number; // Asegúrate de que price sea un número
  thumbnail: string;
  quantity: number;
  offer?: {
    number: number;
    percent: number;
  };
  discountPercent?: number;
}
