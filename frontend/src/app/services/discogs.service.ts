import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {
  private apiUrl = 'https://api.discogs.com/users/BarcelonaCityRecord/inventory?&per_page=40';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<any> {
    // Simulamos una llamada a la API con un retraso artificial
    return this.http.get<any>(this.apiUrl).pipe(
      delay(1000), // Simular un retraso de 1 segundo
      tap(response => response.listings || [])
    );
  }
}
