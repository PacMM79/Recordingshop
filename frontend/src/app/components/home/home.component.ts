import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { DiscogsService } from '../../services/discogs.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  loading = true;
  progress = 0;
  showAlert = false;
  addedProductTitle: string = ''; // Mantén el título del producto añadido

  constructor(private cartService: CartService, private discogsService: DiscogsService) {}

  ngOnInit(): void {
    console.log('Fetching inventory...');
    this.discogsService.getInventory().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching inventory:', error);
        this.loading = false;
      },
      complete: () => {
        console.log('Inventory fetch complete');
        this.loading = false;
      }
    });

    // Simula el progreso de carga
    const interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 10;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  buyProduct(id: number): void {
    const product = this.products.find(product => product.id === id);
    if (product) {
      this.cartService.buy(id, this.products);
      this.addedProductTitle = product.release.title; // Guarda el título del producto añadido
      this.showAlert = true;
      
      // Oculta la alerta después de 3 segundos
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  }
}
