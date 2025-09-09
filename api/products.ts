// src/api/products.ts
import requests from './httpService';

export type Product = {
  id: number;
  name: string;
  price: string;
  images: { src: string }[];
};

export const WooCommerceAPI = {
  getProducts: () => requests.get<Product[]>('products'),
  getProduct: (id: number) => requests.get<Product>(`products/${id}`),
};
