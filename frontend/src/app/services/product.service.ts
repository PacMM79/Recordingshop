import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Products } from '../interfaces/products-interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Products[] = []

  private productsSubject: BehaviorSubject<Products[]> = new BehaviorSubject<Products[]>(this.products);

  constructor() {}

  getProducts(): Observable<Products[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Products | undefined {
    return this.products.find(product => product.id === id);
  }

}
