import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Image,
  ActivityIndicator,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RenderHtml from 'react-native-render-html';
import { WooCommerceAPI, Product } from '~/api/products';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await WooCommerceAPI.getProduct(Number(id));
        setProduct(data);
        // Optionally log full raw product object
        // WooCommerceAPI.getProductNoType(Number(id)).then((data) => console.log(data));
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Product not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
        {/* Product Image */}
        {product.images[0] && (
          <Image
            source={{ uri: product.images[0].src }}
            className="mb-4 h-64 w-64 object-contain"
          />
        )}

        {/* Product Name & Price */}
        <Text className="mb-2 text-center text-2xl font-bold">{product.name}</Text>
        <Text className="mb-4 text-lg text-green-600">${product.price}</Text>

        {/* Product Categories */}
        {product.categories && product.categories.length > 0 && (
          <View className="mb-4 flex-row flex-wrap justify-center">
            {product.categories.map((cat) => (
              <Text
                key={cat.id}
                className="m-1 rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-800">
                {cat.name}
              </Text>
            ))}
          </View>
        )}

        {/* Product Attributes */}
        {product.attributes && product.attributes.length > 0 && (
          <View className="mb-4 w-full">
            {product.attributes.map((attr) => (
              <View key={attr.id} className="mb-2">
                <Text className="font-semibold">{attr.name}:</Text>
                <Text>{attr.options.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Product Description (HTML) */}
        {product.description ? (
          <View className="w-full">
            <RenderHtml
              contentWidth={width - 32} // padding accounted
              source={{ html: product.description }}
              baseStyle={{ color: '#000', fontSize: 16, lineHeight: 24 }}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
