/**
 * 主應用程式元件
 * 管理AI分身選擇、詳情查看、對話練習的導航流程
 */

import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { CompanionSelector } from '../CompanionSelector'
import { AddCompanionData } from './AddCompanionData'
import { EditCompanion } from './EditCompanion'
import { ConversationHistory } from './ConversationHistory'
import { QuickAnalysis } from './QuickAnalysis'
import { LoginModal } from '../LoginModal'
import { useCompanionStore } from '../../stores/assistantStore'
import { useUserStore } from '../../stores/userStore'
import { validateCurrentAuth } from '../../services/authService'
import { AICompanion } from '../../types/assistant'

type AppScreen = 'selector' | 'addData' | 'editCompanion' | 'conversationHistory' | 'quickAnalysis'

export const MainApp: React.FC = () => {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('selector')
  const [selectedCompanion, setSelectedCompanionState] = useState<AICompanion | null>(null)
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  const { setSelectedCompanion, addUserData, createCompanion, updateCompanion } = useCompanionStore()
  const { isLoggedIn, setLoading } = useUserStore()

  // 檢查登入狀態
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true)

      try {
        // 驗證現有的認證狀態
        const isValid = await validateCurrentAuth()

        if (!isValid && !isLoggedIn) {
          // 如果未登入，顯示登入彈窗
          setIsLoginModalVisible(true)
        }
      } catch (error) {
        console.error('Auth validation error:', error)
        // 發生錯誤時也顯示登入彈窗
        if (!isLoggedIn) {
          setIsLoginModalVisible(true)
        }
      } finally {
        setLoading(false)
        setIsAuthChecked(true)
      }
    }

    checkAuthStatus()
  }, [isLoggedIn, setLoading])

  /**
   * 處理登入成功
   */
  const handleLoginSuccess = () => {
    setIsLoginModalVisible(false)
  }

  /**
   * 處理選擇AI分身查看詳情
   */
  const handleViewCompanionProfile = (companion: AICompanion) => {
    // 導航到獨立的助手詳情頁面
    router.push({
      pathname: '/assistant-detail',
      params: { id: companion.id }
    })
  }

  /**
   * 處理直接選擇AI分身開始聊天輔助
   */
  const handleSelectCompanion = (companion: AICompanion) => {
    setSelectedCompanion(companion)
    setSelectedCompanionState(companion)
    console.log('開始使用', companion.name, '的AI分身輔助聊天')

    // 使用路由導航到對話練習頁面
    router.push({
      pathname: '/conversation-practice',
      params: {
        id: companion.id,
        name: companion.name,
        avatar: companion.avatar,
        gender: companion.gender,
        age: companion.age.toString(),
        bio: companion.bio
      }
    })
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
   * 處理快速分析
   */
  const handleQuickAnalysis = (companion: AICompanion) => {
    setSelectedCompanionState(companion)
    setCurrentScreen('quickAnalysis')
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
            onQuickAnalysis={handleQuickAnalysis}
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
                // 現有助手的資料新增完成後返回選擇器
                setCurrentScreen('selector')
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
                // 現有助手的資料新增完成後返回選擇器
                setCurrentScreen('selector')
              }
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
            onQuickAnalysis={handleQuickAnalysis}
          />
        )

      case 'editCompanion':
        return selectedCompanion ? (
          <EditCompanion
            companion={selectedCompanion}
            onBack={() => setCurrentScreen('selector')}
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
            onQuickAnalysis={handleQuickAnalysis}
          />
        )

      case 'conversationHistory':
        return selectedCompanion ? (
          <ConversationHistory
            companion={selectedCompanion}
            onBack={() => setCurrentScreen('selector')}
            onViewConversation={(conversationId) => {
              console.log('查看對話詳情:', conversationId)
            }}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
            onQuickAnalysis={handleQuickAnalysis}
          />
        )



      case 'quickAnalysis':
        return selectedCompanion ? (
          <QuickAnalysis
            companion={selectedCompanion}
            onBack={() => setCurrentScreen('selector')}
          />
        ) : (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
            onQuickAnalysis={handleQuickAnalysis}
          />
        )

      default:
        return (
          <CompanionSelector
            onSelectCompanion={handleSelectCompanion}
            onViewProfile={handleViewCompanionProfile}
            onCreateCompanion={handleCreateCompanion}
            onQuickAnalysis={handleQuickAnalysis}
          />
        )
    }
  }

  // 如果還在檢查認證狀態，或未登入時也要顯示背景內容
  if (!isAuthChecked || (!isLoggedIn && isLoginModalVisible)) {
    return (
      <View style={styles.container}>
        {/* 顯示主要內容作為背景 */}
        {renderCurrentScreen()}

        {/* 登入彈窗 */}
        <LoginModal
          isVisible={isLoginModalVisible}
          onLoginSuccess={handleLoginSuccess}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}

      {/* 登入彈窗 - 在特殊情況下可能會再次顯示 */}
      <LoginModal
        isVisible={isLoginModalVisible}
        onLoginSuccess={handleLoginSuccess}
      />
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