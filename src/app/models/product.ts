import { Category } from "./category";

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  imageBase64?: string;
  category: Category;   // 👈 maintenant c’est un objet
}