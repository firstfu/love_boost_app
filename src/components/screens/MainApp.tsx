/**
 * 主應用程式元件
 * 管理AI分身選擇、詳情查看、對話練習的導航流程
 */

import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { CompanionSelector } from '../CompanionSelector'
import { useCompanionStore } from '../../stores/assistantStore'
import { AICompanion } from '../../types/assistant'

type AppScreen = 'selector' | 'profile' | 'conversation'

export const MainApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('selector')

  const { setSelectedCompanion } = useCompanionStore()

  /**
   * 處理選擇AI分身查看詳情
   */
  const handleViewCompanionProfile = (companion: AICompanion) => {
    // TODO: 實現AI分身詳情頁面導航
    console.log('查看AI分身詳情:', companion.name)
    setCurrentScreen('profile')
  }

  /**
   * 處理直接選擇AI分身開始對話練習
   */
  const handleSelectCompanion = (companion: AICompanion) => {
    setSelectedCompanion(companion)
    // TODO: 導航到對話練習介面
    console.log('開始與', companion.name, '練習對話')
  }

  // 根據當前螢幕狀態渲染對應頁面
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'selector':
        return (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
          />
        )

      case 'profile':
        // TODO: 實現AI分身詳情頁面
        return (
          <View style={styles.placeholderContainer}>
            {/* 暫時顯示選擇器，後續實現詳情頁面 */}
            <CompanionSelector
              onSelectCompanion={handleSelectCompanion}
              onViewProfile={handleViewCompanionProfile}
            />
          </View>
        )

      case 'conversation':
        // TODO: 實現對話練習介面
        return (
          <View style={styles.placeholderContainer}>
            {/* 暫時顯示選擇器，後續實現對話介面 */}
            <CompanionSelector
              onSelectCompanion={handleSelectCompanion}
              onViewProfile={handleViewCompanionProfile}
            />
          </View>
        )

      default:
        return (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
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