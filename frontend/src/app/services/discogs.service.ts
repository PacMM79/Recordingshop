import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {
  private apiUrl = 'https://api.discogs.com/users/BarcelonaCityRecord/inventory?&per_page=20';

  constructor(private http: HttpClient) { }

  getInventory(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.listings || []) // Asegúrate de que estamos accediendo a 'listings'
    );
  }
}
