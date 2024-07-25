import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Products } from '../../interfaces/products';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  cart: Products[] = [];
  subtotal: number = 0;
  total: number = 0;
  cartCount: number = 0;
  checkoutForm!: FormGroup;
  currentUser: any;
  hasDiscount: boolean = false;
  readonly SHIPPING_COST = 10;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

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

    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngAfterViewInit(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: { order: { create: (arg0: { purchase_units: { amount: { value: number; }; }[]; }) => any; }; }) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.subtotal + this.SHIPPING_COST
            }
          }]
        });
      },
      onApprove: (data: any, actions: { order: { capture: () => Promise<any>; }; }) => {
        return actions.order.capture().then((details: any) => {
          this.placeOrder();
        });
      }
    }).render('#paypal-button-container');
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
    this.hasDiscount = false;
    this.subtotal = this.cart.reduce((acc, product) => {
      const discountPercent = (product.offer && product.quantity >= product.offer.number) ? product.offer.percent : (product.discountPercent || 0);
      const discount = discountPercent / 100;
      const discountedPrice = product.price * (1 - discount);
      const totalPrice = discountedPrice * product.quantity;

      if (discount > 0) {
        this.hasDiscount = true;
      }

      return acc + totalPrice;
    }, 0);

    this.total = parseFloat((this.subtotal + this.SHIPPING_COST).toFixed(2));
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
      return;
    }
    const orderData = {
      ...this.checkoutForm.value,
      cart: this.cart
    };
    this.placeOrder(orderData);
  }

  placeOrder(orderData?: any) {
    const data = orderData || this.checkoutForm.value;
    this.http.post('https://barcelonacityrecords.franp.sg-host.com/API/orders.php', data)
      .subscribe({
        next: response => {
          console.log('Order placed successfully', response);
          this.router.navigate(['/order-success']);
        },
        error: error => {
          console.error('Error placing order', error);
        }
      });
  }
}
