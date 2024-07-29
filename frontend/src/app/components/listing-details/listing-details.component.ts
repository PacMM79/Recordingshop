import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscogsService } from '../../services/discogs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-details.component.html',
  styleUrl: './listing-details.component.scss'
})
export class ListingDetailsComponent implements OnInit {
  listingDetails: any;

  constructor(
    private route: ActivatedRoute,
    private discogsService: DiscogsService
  ) { }

  ngOnInit(): void {
    const resourceUrl = this.route.snapshot.paramMap.get('resourceUrl');
    if (resourceUrl) {
      this.discogsService.getListingDetails(resourceUrl).subscribe(details => {
        this.listingDetails = details;
      });
    }
  }
}
