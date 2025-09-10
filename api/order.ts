// src/api/order.ts
import requests from './httpService';

// ---------- Types ----------
export type OrderItem = {
  product_id: number;
  quantity: number;
  variation_id?: number;
};

export type OrderPayload = {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: OrderItem[];
  shipping_lines?: {
    method_id: string;
    method_title: string;
    total: string;
  }[];
  meta_data: [
    {
      key: string;
      value: string;
    },
  ];
};

export type OrderResponse = {
  id: number;
  status: string;
  total: string;
  currency: string;
};

// ---------- API ----------
export const WooOrderAPI = {
  // Create a new order
  createOrder: (order: OrderPayload) => requests.post<OrderResponse>('orders', order),

  // Get all orders (optionally filter by customer)
  getOrders: (params?: Record<string, any>) => requests.get<OrderResponse[]>('orders', { params }),

  // Get order by ID
  getOrder: (id: number) => requests.get<OrderResponse>(`orders/${id}`),

  // Update order (e.g., change status)
  updateOrder: (id: number, data: Partial<OrderPayload>) =>
    requests.put<OrderResponse>(`orders/${id}`, data),
};

// import { WooOrderAPI } from "../api/order";

export async function placeOrder() {
  try {
    const order = await WooOrderAPI.createOrder({
      payment_method: 'bacs',
      payment_method_title: 'Direct Bank Transfer',
      set_paid: false,
      billing: {
        first_name: 'John',
        last_name: 'Doe',
        address_1: '123 Test St',
        city: 'New York',
        state: 'NY',
        postcode: '10001',
        country: 'US',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
      shipping: {
        first_name: 'John',
        last_name: 'Doe',
        address_1: '123 Test St',
        city: 'New York',
        state: 'NY',
        postcode: '10001',
        country: 'US',
      },
      line_items: [
        {
          product_id: 15, // replace with real WooCommerce product ID
          quantity: 1,
        },
      ],
      meta_data: [
        {
          key: '_order_origin',
          value: 'React Native App',
        },
      ],
    });

    console.log('✅ Order Created:', order);
  } catch (err) {
    console.error('❌ Order Creation Failed:', err);
  }
}
