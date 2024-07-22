import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Products } from '../interfaces/products';
import { CommonModule } from '@angular/common';
import { CartModalComponent } from '../shared/cart-modal.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CartModalComponent],
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
  }

  private updateCartCount(): void {
    this.cartCount = this.cart.reduce((count, product) => count + product.quantity, 0);
  }
}
