import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { placeOrder } from '~/api/order';
import { Button } from '~/components/Button';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View>
        <Button title="Place Dummy order" onPress={placeOrder} />
      </View>
    </>
  );
}
