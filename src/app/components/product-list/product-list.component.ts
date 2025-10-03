import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import {  Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
products: (Product & { safeImageUrl?: SafeUrl })[] = [];
  categories: Category[] = [];
  selectedCategory: number | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private categoryService: CategoryService,


  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories  = categories;
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory !== null) {
      this.productService.getProducts().subscribe(products => {
        this.products = products.filter(p => p.category.id === this.selectedCategory);
      });
    } else {
      this.loadProducts();
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      });
    }
  }

 // Méthode pour gérer les erreurs d'image
onImageError(event: Event): void {
  const imgElement = event.target as HTMLImageElement;
  
  // Vérifier si l'URL est corrompue (contient du texte)
  if (imgElement.src.includes('successfully:') || !imgElement.src.startsWith('http')) {
    // Extraire le vrai chemin de l'image de l'URL corrompue
    const corruptedUrl = imgElement.src;
    const match = corruptedUrl.match(/\/images\/[^ ]+/);
    
    if (match) {
      const imagePath = match[0];
      imgElement.src = 'http://localhost:8081' + imagePath;
      return;
    }
  }
  
  // Fallback normal
  if (imgElement.src.includes('dummyimage.com')) {
    return;
  }
  
  imgElement.src = 'https://dummyimage.com/50x50/e9ecef/6c757d&text=🚫+Image';
  imgElement.alt = 'Image non disponible';
}

getSafeImage(base64: string): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(
    base64.startsWith('data:') ? base64 : 'data:image/jpeg;base64,' + base64
  );
}

getImageSrc(product: Product): any {
  if (product.imageBase64) {
    return this.getSafeImage(product.imageBase64);
  } 

  return product.imageUrl; // also sanitize URLs
}

}
