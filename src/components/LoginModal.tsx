/**
 * 登入彈窗組件
 * 提供Apple登入功能的彈窗界面
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Alert,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as AppleAuthentication from 'expo-apple-authentication'
import { LinearGradient } from 'expo-linear-gradient'
import { signInWithApple, handleSuccessfulLogin, isAppleAuthAvailable } from '../services/authService'

interface LoginModalProps {
  isVisible: boolean
  onLoginSuccess: () => void
  onClose?: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isVisible,
  onLoginSuccess,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false)

  // 檢查Apple登入可用性
  useEffect(() => {
    const checkAppleAuth = async () => {
      const available = await isAppleAuthAvailable()
      setAppleAuthAvailable(available)
    }
    checkAppleAuth()
  }, [])

  // 彈窗動畫
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isVisible, fadeAnim, slideAnim])

  // 處理Apple登入
  const handleAppleSignIn = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const result = await signInWithApple()

      if (result.success && result.user) {
        // 處理成功登入（包含後端驗證）
        const loginSuccess = await handleSuccessfulLogin(result.user)

        if (loginSuccess) {
          onLoginSuccess()
        } else {
          Alert.alert('登入失敗', '後端驗證失敗，請重試')
        }
      } else {
        // 顯示錯誤訊息
        if (result.error && result.error !== '用戶取消登入') {
          Alert.alert('登入失敗', result.error)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert('登入失敗', '發生未預期的錯誤，請重試')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* 頂部裝飾漸層 */}
            <LinearGradient
              colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
              locations={[0, 0.4, 1]}
              style={styles.headerGradient}
            />

            {/* 關閉按鈕 */}
            {onClose && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                disabled={isLoading}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            )}

            {/* Logo區域 */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="heart" size={48} color="#FF6B9D" />
              </View>
              <Text style={styles.logoText}>愛情助手</Text>
            </View>

            {/* 標題和描述 */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>歡迎使用愛情助手</Text>
              <Text style={styles.subtitle}>
                登入開始您的戀愛之旅{'\n'}讓AI助手幫您更了解她
              </Text>
            </View>

            {/* 登入按鈕區域 */}
            <View style={styles.buttonContainer}>
              {appleAuthAvailable ? (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={12}
                  style={[styles.appleButton, isLoading && styles.appleButtonDisabled]}
                  onPress={handleAppleSignIn}
                />
              ) : (
                <View style={styles.unavailableContainer}>
                  <Text style={styles.unavailableText}>
                    {Platform.OS === 'ios'
                      ? 'Apple 登入暫時無法使用'
                      : '此設備不支援 Apple 登入'}
                  </Text>
                </View>
              )}

              {isLoading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>登入中...</Text>
                </View>
              )}
            </View>

            {/* 隱私條款 */}
            <View style={styles.privacyContainer}>
              <Text style={styles.privacyText}>
                登入即表示您同意我們的
                <Text style={styles.privacyLink}> 使用條款 </Text>
                和
                <Text style={styles.privacyLink}> 隱私政策</Text>
              </Text>
            </View>

            {/* 功能預覽 */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Ionicons name="sparkles" size={16} color="#9333EA" />
                <Text style={styles.featureText}>AI個性分析</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="chatbubbles" size={16} color="#059669" />
                <Text style={styles.featureText}>聊天建議</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="heart" size={16} color="#DC2626" />
                <Text style={styles.featureText}>關係洞察</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  headerGradient: {
    height: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoIcon: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 32,
    padding: 16,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B9D',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  appleButton: {
    width: '100%',
    height: 52,
  },
  appleButtonDisabled: {
    opacity: 0.6,
  },
  unavailableContainer: {
    height: 52,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  unavailableText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  privacyContainer: {
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  privacyText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyLink: {
    color: '#FF6B9D',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 8,
    paddingTop: 20,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
})