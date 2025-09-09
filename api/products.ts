// src/api/products.ts
import requests from './httpService';

export type Product = {
  id: number;
  name: string;
  price: string;
  images: { src: string }[];
  description: string;
  attributes?: { id: number; name: string; options: string[] }[];
  categories?: { id: number; name: string }[];
};

export const WooCommerceAPI = {
  getProducts: () => requests.get<Product[]>('products'),
  getProduct: (id: number) => requests.get<Product>(`products/${id}`),
  getProductNoType: (id: number) => requests.get(`products/${id}`),
};
