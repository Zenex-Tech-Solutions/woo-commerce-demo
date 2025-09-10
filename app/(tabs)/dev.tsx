// src/screens/DEV.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import { Text } from '~/components/nativewindui/Text';

export default function DEV() {
  const sendSimpleNotification = async () => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: '🚀 Test Notification',
      body: 'This is a simple test notification!',
      android: {
        channelId,
        pressAction: { id: 'default' },
      },
    });
  };

  const sendBigPictureNotification = async () => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'images',
      name: 'Image Notifications',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: '🖼️ Big Picture Style',
      body: 'Swipe down to reveal the picture!',
      android: {
        channelId,
        style: {
          type: AndroidStyle.BIGPICTURE,
          picture:
            'https://images.unsplash.com/photo-1757348772955-e7e61b415ba4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D', // Replace with your own image URL
        },
        largeIcon: 'https://placekitten.com/100/100', // optional
        pressAction: { id: 'default' },
      },
    });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="mb-6 text-2xl font-bold">DEV</Text>

      {/* Simple Notification */}
      <TouchableOpacity
        onPress={sendSimpleNotification}
        className="mb-4 rounded-lg bg-blue-600 px-6 py-3">
        <Text className="text-white">Send Simple Notification</Text>
      </TouchableOpacity>

      {/* Big Picture Notification */}
      <TouchableOpacity
        onPress={sendBigPictureNotification}
        className="rounded-lg bg-green-600 px-6 py-3">
        <Text className="text-white">Send Big Picture Notification</Text>
      </TouchableOpacity>
    </View>
  );
}
