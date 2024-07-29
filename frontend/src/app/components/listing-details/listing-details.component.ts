// listing-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscogsService } from '../../services/discogs.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss']
})
export class ListingDetailsComponent implements OnInit {
  listingDetails: any;
  addedProductTitle: string = '';
  showAlert = false;

  constructor(
    private route: ActivatedRoute,
    private discogsService: DiscogsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const resourceUrl = this.route.snapshot.paramMap.get('resourceUrl');
    if (resourceUrl) {
      this.discogsService.getListingDetails(resourceUrl).subscribe(details => {
       
        this.listingDetails = details;
      });
    }
  }

  buyProduct(): void {
    if (this.listingDetails) {
      this.cartService.buy(this.listingDetails.id, [this.listingDetails]);
      this.addedProductTitle = this.listingDetails.release.artist + ' - ' + this.listingDetails.release.title;
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  }
}
