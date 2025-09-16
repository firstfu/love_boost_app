import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { DefaultAvatar } from '@/src/components/DefaultAvatar';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// 自定義對話練習 Header 組件
const ConversationPracticeHeader = ({ navigation, route }: any) => {
  console.log('ConversationPracticeHeader route params:', route?.params);
  const params = route?.params || {};
  const companionName = params.name || 'AI助手';
  const companionAvatar = params.avatar || '🤖';
  const companionGender = params.gender || 'female';
  const isTyping = params.isTyping || false;

  return (
    <LinearGradient
      colors={["#FF7BA7", "#FF87B2", "#FF96C0"]}
      locations={[0, 0.4, 1]}
      style={{
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 20,
        minHeight: 120,
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 32,
        marginTop: 8,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <DefaultAvatar gender={companionGender} size={32} realAvatar={companionAvatar} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
            }}>
              {companionName}
            </Text>
            {isTyping && (
              <Text style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 12,
              }}>
                正在輸入...
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            Alert.alert(
              "對話練習說明",
              "• 與AI助手進行模擬對話\n• 參考智能建議提升聊天技巧\n• 查看每則訊息的品質評分\n• 學習不同的聊天技巧和話術",
              [{ text: "了解", style: "default" }]
            );
          }}
        >
          <Ionicons name="help-circle" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="settings"
          options={{
            title: '應用設定',
            headerShown: true,
            headerBackTitle: '我的'
          }}
        />
        <Stack.Screen
          name="guide"
          options={{
            title: '使用指南',
            headerShown: true,
            headerBackTitle: '我的'
          }}
        />
        <Stack.Screen
          name="support"
          options={{
            title: '聯絡支援',
            headerShown: true,
            headerBackTitle: '我的'
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: '關於我們',
            headerShown: true,
            headerBackTitle: '我的'
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            title: '隱私權政策',
            headerShown: true,
            headerBackTitle: '關於我們'
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            title: '使用條款',
            headerShown: true,
            headerBackTitle: '關於我們'
          }}
        />
        <Stack.Screen
          name="conversation-practice"
          options={{
            headerShown: true,
            header: (props) => <ConversationPracticeHeader {...props} />
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
