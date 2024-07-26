import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Products } from '../../interfaces/products';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  cart: Products[] = [];
  subtotal: number = 0;
  total: number = 0;
  cartCount: number = 0;
  currentUser: any;
  hasDiscount: boolean = false;
  readonly SHIPPING_COST = 10;

  constructor(
    private cartService: CartService,
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
        return actions.order.capture().then(details => {
          this.processOrder();
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

  processOrder() {
    const orderData = {
      cart: this.cart
    };

    this.http.post('https://barcelonacityrecords.franp.sg-host.com/API/orders.php', orderData)
      .subscribe({
        next: response => {
          console.log('Order placed successfully', response);
          this.cleanCart();
          this.router.navigate(['/order-success']);
        },
        error: error => {
          console.error('Error placing order', error);
        }
      });
  }
}
