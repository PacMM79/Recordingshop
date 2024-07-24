import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Products } from '../../interfaces/products';
import { CommonModule } from '@angular/common';
import { CartModalComponent } from '../../shared/cart-modal.component';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

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
  currentUser: any;

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cartService.cartSubject.subscribe((cart) => {
      this.cart = cart;
      this.updateCartCount();
      this.currentUser = this.authService;
    });
  }

  private updateCartCount(): void {
    this.cartCount = this.cart.reduce((count, product) => count + product.quantity, 0);
  }

  logout() {
    this.authService.logout();
  }
}
