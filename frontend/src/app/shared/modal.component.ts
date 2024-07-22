import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Products } from '../interfaces/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {
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

  buyProduct(productId: number): void {
    // Aquí necesitarías pasar la lista de productos disponibles
    // this.cartService.buy(productId, productosDisponibles);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  calculateTotal(): void {
    this.total = this.cart.reduce((acc, product) => acc + (product.price * product.quantity * (1 - (product.discountPercent || 0) / 100)), 0);
  }
}
