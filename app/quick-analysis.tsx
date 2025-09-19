/**
 * 快速分析頁面 - 獨立路由
 * 提供助手的快速分析功能
 */

import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { QuickAnalysis } from '@/src/components/screens/QuickAnalysis'
import { useCompanionStore } from '@/src/stores/assistantStore'

export default function QuickAnalysisScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { companions } = useCompanionStore()

  // 從路由參數獲取助手ID
  const assistantId = params.id as string

  console.log('QuickAnalysisScreen 已加載，接收到的參數:', params)
  console.log('助手ID:', assistantId)

  // 根據ID查找助手
  const companion = companions.find(c => c.id === assistantId)

  if (!companion) {
    // 如果找不到助手，返回上一頁
    router.back()
    return null
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <QuickAnalysis
      companion={companion}
      onBack={handleBack}
    />
  )
}