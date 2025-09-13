/**
 * 主應用程式元件
 * 管理AI助手選擇、詳情查看的導航流程
 */

import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { AssistantSelector } from '../AssistantSelector'
import { useAssistantStore } from '../../stores/assistantStore'
import { AIAssistant } from '../../types/assistant'

type AppScreen = 'selector' | 'profile' | 'conversation'

export const MainApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('selector')

  const { setSelectedAssistant } = useAssistantStore()

  /**
   * 處理選擇AI助手查看詳情
   */
  const handleViewAssistantProfile = (assistant: AIAssistant) => {
    // TODO: 實現助手詳情頁面導航
    console.log('查看助手詳情:', assistant.name)
    setCurrentScreen('profile')
  }

  /**
   * 處理直接選擇AI助手開始使用
   */
  const handleSelectAssistant = (assistant: AIAssistant) => {
    setSelectedAssistant(assistant)
    // TODO: 導航到對話介面或助手功能頁面
    console.log('已選擇助手:', assistant.name)
  }

  // 根據當前螢幕狀態渲染對應頁面
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'selector':
        return (
          <AssistantSelector
            onSelectAssistant={handleSelectAssistant}
            onViewProfile={handleViewAssistantProfile}
          />
        )

      case 'profile':
        // TODO: 實現助手詳情頁面
        return (
          <View style={styles.placeholderContainer}>
            {/* 暫時顯示選擇器，後續實現詳情頁面 */}
            <AssistantSelector
              onSelectAssistant={handleSelectAssistant}
              onViewProfile={handleViewAssistantProfile}
            />
          </View>
        )

      case 'conversation':
        // TODO: 實現對話介面
        return (
          <View style={styles.placeholderContainer}>
            {/* 暫時顯示選擇器，後續實現對話介面 */}
            <AssistantSelector
              onSelectAssistant={handleSelectAssistant}
              onViewProfile={handleViewAssistantProfile}
            />
          </View>
        )

      default:
        return (
          <AssistantSelector
            onSelectAssistant={handleSelectAssistant}
            onViewProfile={handleViewAssistantProfile}
          />
        )
    }
  }

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  placeholderContainer: {
    flex: 1,
  },
})