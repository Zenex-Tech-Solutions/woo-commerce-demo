// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../api/products';
import { useCartStore } from '../store/cartStore';

type Props = {
  product: Product;
  onPress?: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  const [quantity, setQuantity] = useState(1);

  const { items, addToCart, updateQuantity, removeFromCart } = useCartStore();

  // check if product already in cart
  const cartItem = items.find((item) => item.product_id === product.id);

  const increaseQty = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQty = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) removeFromCart(product.id);
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      }
    } else {
      setQuantity((q) => (q > 1 ? q - 1 : 1));
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <TouchableOpacity
      className="mb-4 flex-row items-center rounded-lg bg-white p-4 shadow"
      onPress={onPress}
      activeOpacity={0.9}>
      <Image
        source={{ uri: product.images[0]?.src }}
        style={{ width: 100, height: 100, marginRight: 12, borderRadius: 8 }}
      />
      <View className="flex-1">
        <Text className="text-lg font-bold">{product.name}</Text>
        <Text className="mt-1 text-green-600">${product.price}</Text>

        {/* Show "Add" if not in cart, else quantity selector */}
        {cartItem ? (
          <View className="mt-2 flex-row items-center">
            <TouchableOpacity
              onPress={decreaseQty}
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <Text className="text-lg font-bold">-</Text>
            </TouchableOpacity>

            <Text className="mx-3 text-lg">{cartItem.quantity}</Text>

            <TouchableOpacity
              onPress={increaseQty}
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <Text className="text-lg font-bold">+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleAddToCart}
            className="mt-2 rounded-lg bg-blue-600 px-3 py-1">
            <Text className="text-white">Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
