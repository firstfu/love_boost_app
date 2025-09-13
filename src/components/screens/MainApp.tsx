/**
 * 主應用程式元件
 * 管理AI分身選擇、詳情查看、對話練習的導航流程
 */

import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { CompanionSelector } from '../CompanionSelector'
import { CompanionProfile } from './CompanionProfile'
import { ConversationPractice } from './ConversationPractice'
import { AddCompanionData } from './AddCompanionData'
import { useCompanionStore } from '../../stores/assistantStore'
import { AICompanion } from '../../types/assistant'

type AppScreen = 'selector' | 'profile' | 'conversation' | 'addData'

export const MainApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('selector')
  const [selectedCompanion, setSelectedCompanionState] = useState<AICompanion | null>(null)

  const { setSelectedCompanion, addUserData } = useCompanionStore()

  /**
   * 處理選擇AI分身查看詳情
   */
  const handleViewCompanionProfile = (companion: AICompanion) => {
    setSelectedCompanionState(companion)
    setCurrentScreen('profile')
  }

  /**
   * 處理直接選擇AI分身開始聊天輔助
   */
  const handleSelectCompanion = (companion: AICompanion) => {
    setSelectedCompanion(companion)
    setSelectedCompanionState(companion)
    setCurrentScreen('conversation')
    console.log('開始使用', companion.name, '的AI分身輔助聊天')
  }

  /**
   * 返回助手選擇頁面
   */
  const handleBackToSelector = () => {
    setCurrentScreen('selector')
    setSelectedCompanionState(null)
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
        return selectedCompanion ? (
          <CompanionProfile
            companion={selectedCompanion}
            onBack={handleBackToSelector}
            onStartChat={handleSelectCompanion}
            onAddData={(companion) => {
              setSelectedCompanionState(companion)
              setCurrentScreen('addData')
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
          />
        )

      case 'conversation':
        return selectedCompanion ? (
          <ConversationPractice
            companion={selectedCompanion}
            onBack={handleBackToSelector}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
          />
        )

      case 'addData':
        return selectedCompanion ? (
          <AddCompanionData
            companion={selectedCompanion}
            onBack={() => setCurrentScreen('profile')}
            isUpdate={true}
            onSave={(data) => {
              console.log('儲存新增資料:', data)
              if (selectedCompanion) {
                addUserData(selectedCompanion.id, data)
              }
              setCurrentScreen('profile')
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
          />
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