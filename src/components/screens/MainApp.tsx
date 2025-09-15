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
import { EditCompanion } from './EditCompanion'
import { ConversationHistory } from './ConversationHistory'
import { QuickAnalysis } from './QuickAnalysis'
import { useCompanionStore } from '../../stores/assistantStore'
import { AICompanion } from '../../types/assistant'

type AppScreen = 'selector' | 'profile' | 'conversation' | 'addData' | 'editCompanion' | 'conversationHistory' | 'quickAnalysis'

export const MainApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('selector')
  const [selectedCompanion, setSelectedCompanionState] = useState<AICompanion | null>(null)

  const { setSelectedCompanion, addUserData, createCompanion, updateCompanion } = useCompanionStore()

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
   * 處理創建新AI助手
   */
  const handleCreateCompanion = (companion: AICompanion) => {
    createCompanion(companion)
    setSelectedCompanionState(companion)
    setCurrentScreen('addData') // 創建完成後直接進入資料新增頁面
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
            onCreateCompanion={handleCreateCompanion}
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
            onEditProfile={(companion) => {
              setSelectedCompanionState(companion)
              setCurrentScreen('editCompanion')
            }}
            onViewHistory={(companion) => {
              setSelectedCompanionState(companion)
              setCurrentScreen('conversationHistory')
            }}
            onQuickAnalysis={(companion) => {
              setSelectedCompanionState(companion)
              setCurrentScreen('quickAnalysis')
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
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
            onCreateCompanion={handleCreateCompanion}
          />
        )

      case 'addData':
        return selectedCompanion ? (
          <AddCompanionData
            companion={selectedCompanion}
            onBack={() => {
              // 判斷是否為新建立的助手（ID以 'custom_' 開頭）
              if (selectedCompanion.id.startsWith('custom_')) {
                // 新建助手的資料新增完成後返回選擇器
                setCurrentScreen('selector')
              } else {
                // 現有助手的資料新增完成後返回詳情頁面
                setCurrentScreen('profile')
              }
            }}
            isUpdate={!selectedCompanion.id.startsWith('custom_')}
            onSave={(data) => {
              console.log('儲存新增資料:', data)
              if (selectedCompanion) {
                addUserData(selectedCompanion.id, data)
              }

              // 判斷是否為新建立的助手
              if (selectedCompanion.id.startsWith('custom_')) {
                // 新建助手的資料新增完成後返回選擇器
                setCurrentScreen('selector')
              } else {
                // 現有助手的資料新增完成後返回詳情頁面
                setCurrentScreen('profile')
              }
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
          />
        )

      case 'editCompanion':
        return selectedCompanion ? (
          <EditCompanion
            companion={selectedCompanion}
            onBack={() => setCurrentScreen('profile')}
            onSave={(updatedCompanion) => {
              // 更新助手資料
              updateCompanion(updatedCompanion.id, updatedCompanion)
              setSelectedCompanionState(updatedCompanion)
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
          />
        )

      case 'conversationHistory':
        return selectedCompanion ? (
          <ConversationHistory
            companion={selectedCompanion}
            onBack={() => setCurrentScreen('profile')}
            onViewConversation={(conversationId) => {
              console.log('查看對話詳情:', conversationId)
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
          />
        )



      case 'quickAnalysis':
        return selectedCompanion ? (
          <QuickAnalysis
            companion={selectedCompanion}
            onBack={() => setCurrentScreen('profile')}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
          />
        )

      default:
        return (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
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