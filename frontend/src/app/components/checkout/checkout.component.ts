import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Products } from '../../interfaces/products';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: Products[] = [];
  total: number = 0;
  cartCount: number = 0;
  checkoutForm!: FormGroup;
  currentUser: any;


  constructor(private cartService: CartService, private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      this.calculateTotal();
      this.updateCartCount();
    });

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });

    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      postcode: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });

    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
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

  private updateCartCount(): void {
    this.cartCount = this.cart.reduce((count, product) => count + product.quantity, 0);
  }

  get nameControl() {
    return this.checkoutForm.get('name');
  }

  get emailControl() {
    return this.checkoutForm.get('email');
  }

  get addressControl() {
    return this.checkoutForm.get('address');
  }

  get postcodeControl() {
    return this.checkoutForm.get('postcode');
  }

  get countryControl() {
    return this.checkoutForm.get('country');
  }

  get phoneControl() {
    return this.checkoutForm.get('phone');
  }

  validateForm() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      console.log('Form is invalid!');
      return;
    }
    console.log('Form is valid!');
  }
}
