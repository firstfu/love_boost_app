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
  Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as AppleAuthentication from 'expo-apple-authentication'
import { signInWithApple, handleSuccessfulLogin, isAppleAuthAvailable } from '../services/authService'

interface LoginModalProps {
  isVisible: boolean
  onLoginSuccess: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isVisible,
  onLoginSuccess,
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
            {/* Logo區域 */}
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../assets/images/icon.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.logoText}>愛情助手</Text>
            </View>

            {/* 標題和描述 */}
            <View style={styles.textContainer}>
              <Text style={styles.subtitle}>
                開始您的愛情智慧之旅
              </Text>
            </View>

            {/* 登入按鈕區域 */}
            <View style={styles.buttonContainer}>
              {appleAuthAvailable ? (
                <TouchableOpacity
                  style={[styles.customAppleButton, isLoading && styles.appleButtonDisabled]}
                  onPress={handleAppleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-apple" size={20} color="white" style={styles.appleIcon} />
                  <Text style={styles.appleButtonText}>使用 Apple 登入</Text>
                </TouchableOpacity>
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
                登入即同意
                <Text style={styles.privacyLink}>服務條款</Text>
                及
                <Text style={styles.privacyLink}>隱私政策</Text>
              </Text>
            </View>

            {/* 功能預覽 */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Ionicons name="sparkles" size={20} color="#9333EA" />
                <Text style={styles.featureText}>AI個性分析</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="chatbubbles" size={20} color="#059669" />
                <Text style={styles.featureText}>聊天建議</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="heart" size={20} color="#DC2626" />
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
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B9D',
    letterSpacing: -0.5,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 17,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  appleButtonDisabled: {
    opacity: 0.5,
  },
  customAppleButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#000000',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  appleIcon: {
    marginRight: 8,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  unavailableContainer: {
    height: 54,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  unavailableText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  privacyContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  privacyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyLink: {
    color: '#FF6B9D',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 8,
  },
})