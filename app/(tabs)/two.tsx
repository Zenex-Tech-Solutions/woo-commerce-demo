// src/screens/CartScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCartStore } from '~/store/cartStore';
import { WooCommerceAPI, Product } from '~/api/products';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch product details for items in cart
  useEffect(() => {
    const fetchCartProducts = async () => {
      setLoading(true);
      try {
        const products = await Promise.all(
          items.map((i) => WooCommerceAPI.getProduct(i.product_id))
        );
        setCartProducts(products);
      } catch (err) {
        console.error('❌ Failed to fetch cart products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchCartProducts();
    } else {
      setCartProducts([]);
    }
  }, [items]);

  const total = items.reduce((sum, item) => {
    const product = cartProducts.find((p) => p.id === item.product_id);
    return sum + (product ? parseFloat(product.price) * item.quantity : 0);
  }, 0);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-bold">🛒 Your cart is empty</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cartProducts}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const cartItem = items.find((i) => i.product_id === item.id);
        if (!cartItem) return null;

        return (
          <View className="mb-4 flex-row items-center rounded-lg bg-white p-4 shadow">
            <Image
              source={{ uri: item.images[0]?.src }}
              style={{ width: 80, height: 80, marginRight: 12, borderRadius: 8 }}
            />
            <View className="flex-1">
              <Text className="text-lg font-bold">{item.name}</Text>
              <Text className="text-green-600">${item.price}</Text>

              {/* Quantity Selector */}
              <View className="mt-2 flex-row items-center">
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, Math.max(cartItem.quantity - 1, 1))}
                  className="h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <Text className="text-lg font-bold">-</Text>
                </TouchableOpacity>

                <Text className="mx-3 text-lg">{cartItem.quantity}</Text>

                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, cartItem.quantity + 1)}
                  className="h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <Text className="text-lg font-bold">+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  className="ml-4 rounded-lg bg-red-600 px-3 py-1">
                  <Text className="text-white">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }}
      ListFooterComponent={
        <View className="mt-4 rounded-lg bg-white p-4 shadow">
          <Text className="text-xl font-bold">Total: ${total.toFixed(2)}</Text>

          <TouchableOpacity
            onPress={() => {
              console.log('Proceed to checkout');
              router.push('/checkout'); // ✅ navigate to a checkout screen
            }}
            className="mt-4 rounded-lg bg-blue-600 p-4">
            <Text className="text-center text-lg font-bold text-white">Checkout</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={clearCart} className="mt-2 rounded-lg bg-gray-400 p-3">
            <Text className="text-center text-white">Clear Cart</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}
