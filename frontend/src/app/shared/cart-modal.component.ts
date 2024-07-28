import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Products } from '../interfaces/products-interface';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from '../components/checkout/checkout.component';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, CheckoutComponent],

  templateUrl: './cart-modal.component.html'
})
export class CartModalComponent implements OnInit {
  cart: Products[] = [];
  total: number = 0;
  subtotal: number = 0;
  cartCount: number = 0;
  hasDiscount: boolean = false;
  SHIPPING_COST: number = 10;

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
}
