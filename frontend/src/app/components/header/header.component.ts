import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Products } from '../../interfaces/products-interface';
import { CommonModule } from '@angular/common';
import { CartModalComponent } from '../../shared/cart-modal.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartSubject.subscribe((cart) => {
      this.cart = cart;
      this.updateCartCount();
    });

    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  private updateCartCount(): void {
    this.cartCount = this.cart.reduce((count, product) => count + product.quantity, 0);
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  handleButtonClick() {
    if (!this.currentUser) {
      this.login();
    }
    else
    this.checkout();
  }

  myAccount() {
    this.router.navigate(['/my-account']);
  }
}
