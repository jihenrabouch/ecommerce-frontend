import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Category } from '../../models/category';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  categories: Category[] = [];
  productForm: FormGroup;
  selectedFile: File | null = null;
  uploadMessage: string = '';
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private http: HttpClient,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: [''],
      imageBase64: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onImageError(event: Event): void {
  const imgElement = event.target as HTMLImageElement;
  
  // Empêcher la boucle infinie si on utilise déjà le fallback
  if (imgElement.src.includes('dummyimage.com') || imgElement.src.includes('data:image')) {
    return;
  }
  
  // Utiliser le service dummyimage.com qui fonctionne
  imgElement.src = 'https://dummyimage.com/50x50/cccccc/969696&text=Image+Manquante';
  imgElement.alt = 'Image non disponible';
  imgElement.classList.add('image-error');
}

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

   onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.productForm.patchValue({
          imageBase64: reader.result?.toString()
        });
        this.uploadMessage = '';
      };
      reader.readAsDataURL(file); // transforme en base64
    }
  }
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  //   if (this.selectedFile) {
  //     this.productForm.patchValue({ imageUrl: '' });
  //     this.uploadMessage = '';
  //   }
  // }

onUpload(): void {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile);

  this.http.post('http://localhost:8081/api/products/upload', formData, { responseType: 'text' })
    .subscribe({
      next: (response: string) => {
        console.log('📦 Réponse serveur:', response);
        
        // ⭐ EXTRACTION CORRECTE - méthode robuste
        let imagePath: string;
        
        // Méthode 1: Regex pour extraire le chemin
        const match = response.match(/\/images\/[^ ]+/);
        if (match) {
          imagePath = match[0];
        } 
        // Méthode 2: Split par "successfully:"
        else if (response.includes('successfully:')) {
          const parts = response.split('successfully:');
          imagePath = parts[1].trim();
        }
        // Méthode 3: Si déjà un chemin simple
        else if (response.startsWith('/images/')) {
          imagePath = response;
        }
        else {
          console.error('Format de réponse inconnu:', response);
          this.uploadMessage = 'Format de réponse inconnu';
          return;
        }

        console.log('🖼️ Chemin extrait:', imagePath);
        
        // ⭐ CONSTRUCTION URL COMPLÈTE
        const imageUrl = 'http://localhost:8081' + imagePath;
        console.log('🔗 URL finale:', imageUrl);
        
        // ⭐ VALIDATION DE L'URL
        if (!this.isValidUrl(imageUrl)) {
          console.error('URL invalide:', imageUrl);
          this.uploadMessage = 'URL invalide générée';
          return;
        }
        
        this.uploadMessage = 'Upload réussi !';
        this.productForm.patchValue({ imageUrl: imageUrl });
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('❌ Erreur upload:', err);
        this.uploadMessage = 'Erreur lors de l\'upload: ' + err.message;
      }
    });
}

// ⭐ MÉTHODE DE VALIDATION D'URL
private isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData = this.productForm.value;
    
    this.productService.createProduct(productData, this.selectedFile ?? undefined).subscribe({
      next: () => {
        alert('Produit ajouté avec succès !');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
        alert(`Erreur lors de l'ajout du produit: ${err.error?.message || err.message}`);
      }
    });
  }
}