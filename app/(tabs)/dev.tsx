// src/screens/DEV.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Text } from '~/components/nativewindui/Text';

export default function DEV() {
  const sendTestNotification = async () => {
    try {
      // Request permissions (iOS) & create channel (Android)
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      // Display a test notification
      await notifee.displayNotification({
        title: '🚀 Test Notification',
        body: 'This is a test notification from the DEV screen!',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });

      console.log('✅ Notification displayed');
    } catch (error) {
      console.error('❌ Notification error:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="mb-4 text-xl font-bold">DEV</Text>

      <TouchableOpacity onPress={sendTestNotification} className="rounded-lg bg-blue-600 px-6 py-3">
        <Text className="text-white">Send Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
}
