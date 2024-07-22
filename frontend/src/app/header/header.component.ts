import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Products } from '../interfaces/products';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cart: Products[] = [];
  total: number = 0;
  cartCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartSubject.subscribe((cart) => {
      this.cart = cart;
      this.updateCartCount();
    });

    this.cartService.totalSubject.subscribe((total) => {
      this.total = total;
    });
  }

  removeFromCart(id: number): void {
    this.cartService.removeFromCart(id);
  }

  cleanCart(): void {
    this.cartService.cleanCart();
  }

  buyProduct(id: number): void {
    this.cartService.buy(id, this.cart);
  }

  private updateCartCount(): void {
    this.cartCount = this.cart.reduce((count, product) => count + product.quantity, 0);
  }
}
