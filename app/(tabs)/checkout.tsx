// src/screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useCartStore } from '~/store/cartStore';
import { WooOrderAPI } from '~/api/order';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { items, clearCart } = useCartStore();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    email: '',
    phone: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Check for empty fields
    for (const [key, value] of Object.entries(form)) {
      if (!value.trim()) {
        Alert.alert('Validation Error', `${key.replace('_', ' ')} is required`);
        return false;
      }
    }

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    // Simple phone validation (at least 7 digits)
    if (!/^\d{7,}$/.test(form.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Cart is empty', 'Please add products to your cart.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const order = await WooOrderAPI.createOrder({
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        set_paid: false,
        billing: form,
        shipping: form,
        line_items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
        meta_data: [
          {
            key: '_order_origin',
            value: 'React Native App',
          },
        ],
      });

      clearCart();
      Alert.alert('✅ Order Placed', `Order ID: ${order.id}`);
      console.log('✅ Order Created:', order);
    } catch (err: any) {
      console.error('❌ Order Creation Failed:', err);
      Alert.alert('❌ Failed to place order', err.message || 'Unknown error');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      <ScrollView className="flex-1 bg-gray-100 p-4">
        <Text className="mb-4 text-2xl font-bold">Checkout</Text>

        {/* Billing / Shipping Form */}
        {[
          { key: 'first_name', label: 'First Name' },
          { key: 'last_name', label: 'Last Name' },
          { key: 'address_1', label: 'Address' },
          { key: 'city', label: 'City' },
          { key: 'state', label: 'State' },
          { key: 'postcode', label: 'Postcode' },
          { key: 'country', label: 'Country' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
        ].map((field) => (
          <View key={field.key} className="mb-3">
            <Text className="mb-1 font-medium">{field.label}</Text>
            <TextInput
              value={form[field.key as keyof typeof form]}
              onChangeText={(text) => handleChange(field.key, text)}
              className="rounded-lg border border-gray-300 bg-white p-3"
              placeholder={field.label}
              keyboardType={
                field.key === 'email'
                  ? 'email-address'
                  : field.key === 'phone'
                    ? 'phone-pad'
                    : 'default'
              }
            />
          </View>
        ))}

        {/* Place Order Button */}
        <TouchableOpacity onPress={handlePlaceOrder} className="mb-6 rounded-lg bg-blue-600 p-4">
          <Text className="text-center text-lg font-bold text-white">Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
