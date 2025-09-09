import axios from 'axios';
import { Stack } from 'expo-router';
import requests from '~/api/httpService';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Text } from '~/components/nativewindui/Text';
import ProductsScreen from '~/pages/products';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <Container>
        <Text>Woo-Commerce Demo</Text>
        {/* <Button
          title="index"
          onPress={async () => {
            try {
              console.log('Fetching Index');
              const index = await axios.get('https://clientwork.in.net/archi/wp-json/wc/v3/');
              console.log(index.data); // log only the response data
            } catch (error) {
              console.error('Error fetching index:', error);
            }
          }}
        /> */}

        <ProductsScreen />
      </Container>
    </>
  );
}
