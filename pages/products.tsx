// src/screens/ProductsScreen.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { WooCommerceAPI, Product } from '../api/products';
import ProductCard from '../components/ProductCard';

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    WooCommerceAPI.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error('❌ WooCommerce Error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
      )}
    />
  );
}
