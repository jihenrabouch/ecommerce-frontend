import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/products';
  private categoryUrl = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any, image?: File): Observable<Product> {
    if (image) {
      const formData = new FormData();

      // Image
      formData.append('image', image);

      // Produit + catégorie en objet
      formData.append('product', new Blob([
        JSON.stringify({
          ...product,
          category: { id: product.category } // 👈 conversion automatique
        })
      ], { type: 'application/json' }));

      return this.http.post<Product>(this.apiUrl, formData);
    }

    // Cas sans image → JSON simple
    return this.http.post<Product>(`${this.apiUrl}/simple`, {
      ...product,
      category: { id: product.category }   // 👈 conversion automatique
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
