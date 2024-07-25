import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Products } from '../../interfaces/products';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [CurrencyPipe]
})
export class CheckoutComponent implements OnInit {
  cart: Products[] = [];
  subtotal: number = 0;
  total: number = 0;
  cartCount: number = 0;
  checkoutForm!: FormGroup;
  currentUser: any;
  hasDiscount: boolean = false;
  readonly SHIPPING_COST = 10; // Valor fijo para los gastos de transporte

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => {
      console.log('Cart:', cart); // Verifica los valores aquí
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
    this.hasDiscount = false; // Reinicia el estado de descuento
    this.subtotal = this.cart.reduce((acc, product) => {
      const discountPercent = (product.offer && product.quantity >= product.offer.number) ? product.offer.percent : (product.discountPercent || 0);
      const discount = discountPercent / 100;
      const discountedPrice = product.price * (1 - discount);
      const totalPrice = discountedPrice * product.quantity;

      if (discount > 0) {
        this.hasDiscount = true; // Marca como verdadero si hay algún descuento aplicado
      }

      console.log(`Product: ${product.name}, Price: ${product.price}, Quantity: ${product.quantity}, Discount: ${discountPercent}%, Discounted Price: ${discountedPrice}, Total Price: ${totalPrice}`);

      return acc + totalPrice;
    }, 0);

    this.total = parseFloat((this.subtotal + this.SHIPPING_COST).toFixed(2));
    console.log(`Subtotal: ${this.subtotal}, Shipping Cost: ${this.SHIPPING_COST}, Total: ${this.total}`);
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
    const orderData = {
      ...this.checkoutForm.value,
      cart: this.cart // Agregar el carrito a los datos del pedido
    };
    console.log('Datos del pedido:', orderData); // Verificar los datos antes de enviar
    this.placeOrder(orderData);
  }
  
  placeOrder(orderData: any) {
    console.log('Datos del pedido:', orderData); // Verificar los datos antes de enviar
    this.http.post('https://barcelonacityrecords.franp.sg-host.com/API/orders.php', orderData)
      .subscribe({
        next: (response) => {
          console.log('Order placed successfully', response);
        },
        error: (error) => {
          console.error('Error placing order', error);
        }
      });
  }
  
  

}
