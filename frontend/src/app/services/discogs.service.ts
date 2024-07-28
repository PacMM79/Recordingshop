import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {
  private apiUrl = 'https://api.discogs.com/users/BarcelonaCityRecord/inventory';

  constructor(private http: HttpClient) { }

  getInventory(page: number, perPage: number = 20): Observable<any> {
    const url = `${this.apiUrl}?per_page=${perPage}&page=${page}`;
    return this.http.get<any>(url).pipe(
      map(response => ({
        listings: response.listings || [],
        pagination: response.pagination
      }))
    );
  }
}
