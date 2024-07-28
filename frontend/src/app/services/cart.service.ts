import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Products } from '../interfaces/products-interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart';
  private cart: Products[] = this.loadCart();
  private total: number = this.calculateTotal();

  cartSubject: BehaviorSubject<Products[]> = new BehaviorSubject<Products[]>(this.cart);
  totalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor() {}

  buy(id: number, products: any[]): void {
    const buyProduct = products.find((product) => product.id === id);

    if (buyProduct) {
      const existProduct = this.cart.find((product) => product.id === id);

      if (existProduct) {
        existProduct.quantity++;
      } else {
        const newProduct: Products = {
          id: buyProduct.id,
          name: buyProduct.release.title,
          artist: buyProduct.release.artist,
          price: buyProduct.price.value,
          thumbnail: buyProduct.release.thumbnail,
          quantity: 1,
          currency: buyProduct.price.currency // Asegúrate de incluir la moneda
        };
        this.cart.push(newProduct);
      }

      this.updateCartCounter();
      this.total = this.calculateTotal();
      this.applyPromotionsCart();
      this.updateCartView();
      this.saveCart();
    }
  }

  getCart(): BehaviorSubject<Products[]> {
    return this.cartSubject;
  }

  getTotal(): BehaviorSubject<number> {
    return this.totalSubject;
  }

  cleanCart(): void {
    this.cart = [];
    this.total = 0;
    this.updateCartCounter();
    this.updateCartView();
    this.saveCart();
  }

  calculateTotal(): number {
    return this.cart.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  applyPromotionsCart(): void {
    for (let product of this.cart) {
      if (product.offer) {
        const quantity = this.cart.reduce(
          (total, item) => (item.id === product.id ? total + item.quantity : total),
          0
        );

        product.discountPercent = quantity >= product.offer.number ? product.offer.percent : 0;
      }
    }
  }

  updateCartView(): void {
    this.cartSubject.next(this.cart);
    this.totalSubject.next(this.total);
  }

  removeFromCart(id: number): void {
    const index = this.cart.findIndex((product) => product.id === id);

    if (index !== -1) {
      this.cart[index].quantity--;

      if (this.cart[index].quantity === 0) {
        this.cart.splice(index, 1);
      }

      this.total = this.calculateTotal();
      this.applyPromotionsCart();
      this.updateCartCounter();
      this.updateCartView();
      this.saveCart();
    }
  }

  private updateCartCounter(): void {
    const countProductElement = document.getElementById('count_product');
    if (countProductElement) {
      countProductElement.innerText = this.cart.reduce((total, product) => total + product.quantity, 0).toString();
    }
  }

  openModal(): void {
    this.applyPromotionsCart();
    this.updateCartView();
  }

  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  private loadCart(): Products[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }
}
