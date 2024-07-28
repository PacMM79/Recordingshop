import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { DiscogsService } from '../../services/discogs.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  progress = 0;
  showAlert = false;
  addedProductTitle: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pagesPerGroup: number = 5;
  searchQuery: string = '';
  sortBy: string = '';
  sortOrder: string = 'asc';

  constructor(private cartService: CartService, private discogsService: DiscogsService) {}

  ngOnInit(): void {
    this.loadPage(this.currentPage);

    const interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 10;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  loadPage(page: number): void {
    this.loading = true;
    console.log('Fetching inventory for page', page);
  
    const searchParams = {
      status: 'for sale',
      sort: this.sortBy,
      sortOrder: this.sortOrder
    };
  
    this.discogsService.getInventory(page, 20, searchParams).subscribe({
      next: (data: any) => {
        this.products = data.listings;
        this.filteredProducts = this.filterProducts(this.products);
        this.totalPages = data.pagination.pages;
        this.loading = false;
        this.currentPage = page;
      },
      error: (error) => {
        console.error('Error fetching inventory:', error);
        this.loading = false;
      },
      complete: () => {
        console.log('Inventory fetch complete for page', page);
        this.loading = false;
      }
    });
  }
  
  

  filterProducts(products: any[]): any[] {
    return products.filter(product => {
      const matchesSearch = product.release.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesSearch;
    });
  }
  
  onSearch(): void {
    this.filteredProducts = this.filterProducts(this.products);
  }
  
  

  onSortChange(): void {
    this.loadPage(this.currentPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  firstPageGroup(): void {
    const startPage = 1;
    this.loadPage(startPage);
  }

  lastPageGroup(): void {
    const lastGroupFirstPage = Math.floor((this.totalPages - 1) / this.pagesPerGroup) * this.pagesPerGroup + 1;
    this.loadPage(lastGroupFirstPage);
  }

  buyProduct(id: number): void {
    const product = this.products.find(product => product.id === id);
    if (product) {
      this.cartService.buy(id, this.products);
      this.addedProductTitle = product.release.title;
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  }

  getPagesToShow(): number[] {
    const startPage = Math.floor((this.currentPage - 1) / this.pagesPerGroup) * this.pagesPerGroup + 1;
    const endPage = Math.min(startPage + this.pagesPerGroup - 1, this.totalPages);
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  
}
