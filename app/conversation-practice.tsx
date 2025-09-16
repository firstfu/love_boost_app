/**
 * 對話練習頁面 - Expo Router 頁面
 * 使用 Expo Router 的 navigation header 來替代自定義 header
 */

import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ConversationPractice } from '@/src/components/screens/ConversationPractice'
import { AICompanion } from '@/src/types/assistant'

export default function ConversationPracticePage() {
  const router = useRouter()
  const params = useLocalSearchParams()

  // 從路由參數獲取 companion 信息（簡化版本）
  const companion = {
    id: params.id as string || '1',
    name: params.name as string || 'AI助手',
    avatar: params.avatar as string || '🤖',
    gender: (params.gender as any) || 'female',
    age: parseInt(params.age as string) || 25,
    bio: params.bio as string || '友善的AI助手'
  } as AICompanion

  const handleBack = () => {
    router.back()
  }

  return (
    <ConversationPractice
      companion={companion}
      onBack={handleBack}
    />
  )
}