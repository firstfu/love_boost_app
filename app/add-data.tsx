/**
 * 管理資料頁面 - 獨立路由
 * 提供助手的資料管理功能
 */

import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AddCompanionData } from '@/src/components/screens/AddCompanionData'
import { useCompanionStore } from '@/src/stores/assistantStore'

export default function AddDataScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { companions, addUserData } = useCompanionStore()

  // 從路由參數獲取助手ID
  const assistantId = params.id as string

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

  const handleSave = (data: any) => {
    console.log('儲存新增資料:', data)
    if (companion) {
      addUserData(companion.id, data)
    }
    // 儲存完成後返回上一頁
    router.back()
  }

  return (
    <AddCompanionData
      companion={companion}
      onBack={handleBack}
      isUpdate={true}
      onSave={handleSave}
    />
  )
}