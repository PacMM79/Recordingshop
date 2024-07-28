import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { DiscogsService } from '../../services/discogs.service';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  progress: number = 0;
  loading: boolean = true;

  constructor(private cartService: CartService, private discogsService: DiscogsService) {}

  ngOnInit(): void {
    console.log('Fetching inventory...');
    this.simulateLoadingProgress();
    this.discogsService.getInventory().subscribe({
      next: data => {
        this.products = data.listings || [];
        this.progress = 100;
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching inventory:', error);
        this.loading = false;
      }
    });
  }

  simulateLoadingProgress(): void {
    const interval$ = interval(100); // Incrementa cada 100ms
    interval$.pipe(takeUntil(interval(1000))).subscribe(() => { // Toma valores hasta 1 segundo
      if (this.progress < 100) {
        this.progress += 10; // Incrementa el progreso en 10%
      }
    });
  }

  buyProduct(id: number): void {
    this.cartService.buy(id, this.products);
  }
}
