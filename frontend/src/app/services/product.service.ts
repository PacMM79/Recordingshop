import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Products } from '../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Products[] = [
    {
      id: 1,
      name: 'Curtis Mayfield - Curtis',
      price: 10.5,
      quantity: 5,
      category: 'grocery',
      offer: {
        number: 3,
        percent: 20
      }
    },
    {
      id: 2,
      name: 'Pasta',
      price: 6.25,
      quantity: 1,
      category: 'grocery',
      discountPercent: 10
    },
    {
      id: 3,
      name: 'Instant cupcake mixture',
      price: 5,
      quantity: 1,
      category: 'grocery',
      offer: {
        number: 10,
        percent: 30
      }
    },
    {
      id: 4,
      name: 'All-in-one',
      price: 260,
      quantity: 1,
      category: 'beauty'
    },
    {
      id: 5,
      name: 'Zero Make-up Kit',
      price: 20.5,
      quantity: 1,
      category: 'beauty'
    },
    {
      id: 6,
      name: 'Lip Tints',
      price: 12.75,
      quantity: 1,
      category: 'beauty'
    },
    {
      id: 7,
      name: 'Lawn Dress',
      price: 15,
      quantity: 1,
      category: 'clothes'
    },
    {
      id: 8,
      name: 'Lawn-Chiffon Combo',
      price: 19.99,
      quantity: 1,
      category: 'clothes'
    },
    {
      id: 9,
      name: 'Toddler Frock',
      price: 9.99,
      quantity: 1,
      category: 'clothes'
    }
  ];

  private productsSubject: BehaviorSubject<Products[]> = new BehaviorSubject<Products[]>(this.products);

  constructor() {}

  getProducts(): Observable<Products[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Products | undefined {
    return this.products.find(product => product.id === id);
  }

}
