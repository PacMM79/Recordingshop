import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Products } from '../interfaces/products-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './cart-modal.component.html'
})
export class CartModalComponent implements OnInit {
  cart: Products[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.calculateTotal();
    });

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });
  }

  cleanCart(): void {
    this.cartService.cleanCart();
  }

  buyProduct(id: number): void {
    this.cartService.buy(id, this.cart);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((acc, product) => acc + (product.price * product.quantity * (1 - (product.discountPercent || 0) / 100)), 0);
  }
}
