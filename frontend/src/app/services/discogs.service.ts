import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {
  private apiUrl = 'https://api.discogs.com/users/BarcelonaCityRecord/inventory';

  constructor(private http: HttpClient) { }

  getInventory(page: number, perPage: number = 20, searchParams?: any): Observable<any> {
    let params = new HttpParams()
      .set('per_page', perPage.toString())
      .set('page', page.toString());

    if (searchParams) {
      if (searchParams.status) {
        params = params.set('status', searchParams.status);
      }
      if (searchParams.sort) {
        params = params.set('sort', searchParams.sort);
      }
      if (searchParams.sortOrder) {
        params = params.set('sort_order', searchParams.sortOrder);
      }
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => ({
        listings: response.listings || [],
        pagination: response.pagination
      }))
    );
  }
}
