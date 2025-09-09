import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { WooCommerceAPI, Product } from '../api/products';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    WooCommerceAPI.getProducts()
      .then(setProducts)
      .catch((err) => console.error('❌ WooCommerce Error:', err));
  }, []);

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Image source={{ uri: item.images[0]?.src }} style={{ width: 100, height: 100 }} />
          <Text>{item.name}</Text>
          <Text>${item.price}</Text>
        </View>
      )}
    />
  );
}
