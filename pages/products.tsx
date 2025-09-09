import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { WooCommerceAPI, Product } from '../api/products';

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
        <TouchableOpacity
          className="mb-4 flex-row items-center rounded-lg bg-white p-4 shadow"
          onPress={() => router.push(`/product/${item.id}`)}>
          <Image source={{ uri: item.images[0]?.src }} style={{ width: 100, height: 100 }} />
          <View className="flex-1">
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="mt-1 text-green-600">${item.price}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
