import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { ModalComponent } from '../shared/modal.component';
import { HeaderComponent } from '../header/header.component';
import { Products } from '../interfaces/products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ModalComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Products[] = [];
  cart: Products[] = [];
  total = 0;

  constructor(private cartService: CartService, private productService: ProductService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });

    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  buyProduct(id: number): void {
    this.cartService.buy(id, this.products);
  }

  cleanCart(): void {
    this.cartService.cleanCart();
  }
}
