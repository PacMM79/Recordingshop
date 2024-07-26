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

  constructor(private cartService: CartService, private discogsService: DiscogsService) {}

  ngOnInit(): void {
    console.log('Fetching inventory...');
    this.discogsService.getInventory().subscribe({
      next: data => {
        this.products = data;
      },
      error: error => {
        console.error('Error fetching inventory:', error);
      },
      complete: () => {
        console.log('Inventory fetch complete');
      }
    });
  }

  buyProduct(id: number): void {
    this.cartService.buy(id, this.products);
  }

}
