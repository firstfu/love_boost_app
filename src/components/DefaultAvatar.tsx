/**
 * 默認頭像組件
 * 當用戶沒有上傳頭像時，根據性別顯示預設圖標
 */

import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Gender } from '../types/assistant'

interface DefaultAvatarProps {
  gender: Gender
  size?: number
  backgroundColor?: string
  textColor?: string
  realAvatar?: string
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({
  gender,
  size = 72,
  backgroundColor,
  textColor = '#ffffff',
  realAvatar
}) => {
  // 根據性別選擇顏色和圖標
  const getAvatarConfig = () => {
    switch (gender) {
      case 'female':
        return {
          icon: '👩',
          bgColor: backgroundColor || '#FF6B9D',
          text: '女'
        }
      case 'male':
        return {
          icon: '👨',
          bgColor: backgroundColor || '#4F46E5',
          text: '男'
        }
      default:
        return {
          icon: '👤',
          bgColor: backgroundColor || '#6B7280',
          text: '?'
        }
    }
  }

  const config = getAvatarConfig()

  // 如果有真實頭像，顯示圖片
  if (realAvatar) {
    return (
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          }
        ]}
      >
        <Image
          source={{ uri: realAvatar }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      </View>
    )
  }

  // 否則顯示默認圖標
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.bgColor,
        }
      ]}
    >
      <Text style={[styles.icon, { fontSize: size * 0.4, color: textColor }]}>
        {config.icon}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontWeight: 'bold',
  },
})