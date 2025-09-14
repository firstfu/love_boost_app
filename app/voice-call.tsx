/**
 * 語音通話練習頁面
 * 模擬真實通話環境進行練習
 */

import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Fonts } from '@/constants/theme'

const { width } = Dimensions.get('window')

interface CallState {
  isActive: boolean
  duration: number
  isMuted: boolean
  isSpeakerOn: boolean
  currentPhase: 'connecting' | 'talking' | 'ended'
}

export default function VoiceCallScreen() {
  const router = useRouter()
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    duration: 0,
    isMuted: false,
    isSpeakerOn: false,
    currentPhase: 'connecting',
  })

  const [currentMessage, setCurrentMessage] = useState('正在連接...')
  const [pulseAnim] = useState(new Animated.Value(1))
  const [waveAnim] = useState(new Animated.Value(0))

  // 模擬通話流程的對話內容
  const callScenarios = [
    { time: 3, message: '嗨，你好！很高興能跟你通話', speaker: 'her' },
    { time: 8, message: '今天天氣真不錯，你那邊怎麼樣？', speaker: 'her' },
    { time: 15, message: '我剛才在看書，是一本很有趣的小說', speaker: 'her' },
    { time: 25, message: '你平常喜歡做什麼呢？', speaker: 'her' },
    { time: 35, message: '聽起來很有趣！我也想試試看', speaker: 'her' },
    { time: 45, message: '時間過得真快，我們下次再聊好嗎？', speaker: 'her' },
  ]

  // 計時器效果
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (callState.isActive) {
      interval = setInterval(() => {
        setCallState(prev => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [callState.isActive])

  // 脈衝動畫效果
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )

    if (callState.isActive) {
      pulseAnimation.start()
    } else {
      pulseAnimation.stop()
      pulseAnim.setValue(1)
    }

    return () => pulseAnimation.stop()
  }, [callState.isActive])

  // 波形動畫效果
  useEffect(() => {
    const waveAnimation = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    )

    if (callState.isActive) {
      waveAnimation.start()
    } else {
      waveAnimation.stop()
      waveAnim.setValue(0)
    }

    return () => waveAnimation.stop()
  }, [callState.isActive])

  // 處理通話場景
  useEffect(() => {
    const scenario = callScenarios.find(s => s.time === callState.duration)
    if (scenario) {
      setCurrentMessage(scenario.message)
    }
  }, [callState.duration])

  const startCall = () => {
    setCallState(prev => ({
      ...prev,
      isActive: true,
      currentPhase: 'talking',
      duration: 0,
    }))
    setCurrentMessage('通話已接通')
  }

  const endCall = () => {
    setCallState(prev => ({
      ...prev,
      isActive: false,
      currentPhase: 'ended',
    }))
    setCurrentMessage('通話已結束')

    // 3秒後自動返回
    setTimeout(() => {
      router.back()
    }, 3000)
  }

  const toggleMute = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const toggleSpeaker = () => {
    setCallState(prev => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      {/* 漸層背景 */}
      <LinearGradient
        colors={['#4A90E2', '#5BA2F5', '#6BB8FF']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* 返回按鈕 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* 頭部資訊 */}
      <View style={styles.headerContainer}>
        <Text style={styles.contactName}>小雨</Text>
        <Text style={styles.contactInfo}>24 歲 • 女性</Text>

        {callState.isActive ? (
          <Text style={styles.callTimer}>{formatTime(callState.duration)}</Text>
        ) : (
          <Text style={styles.callStatus}>{currentMessage}</Text>
        )}
      </View>

      {/* 頭像區域 */}
      <View style={styles.avatarContainer}>
        <Animated.View
          style={[
            styles.avatarWrapper,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>小雨</Text>
          </LinearGradient>
        </Animated.View>

        {/* 音波效果 */}
        {callState.isActive && (
          <View style={styles.waveContainer}>
            {[...Array(5)].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    opacity: waveAnim,
                    transform: [{
                      scaleY: waveAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    }],
                    animationDelay: `${index * 100}ms`,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* 當前對話內容 */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{currentMessage}</Text>
        {callState.isActive && (
          <View style={styles.aiTips}>
            <Ionicons name="bulb-outline" size={16} color="#FFD700" />
            <Text style={styles.aiTipsText}>
              {callState.duration < 10 ? '保持輕鬆的語調，先打個招呼' :
               callState.duration < 30 ? '可以聊聊天氣或生活話題' :
               '表現出對她興趣的好奇心'}
            </Text>
          </View>
        )}
      </View>

      {/* 控制按鈕 */}
      <View style={styles.controlsContainer}>
        {callState.currentPhase === 'connecting' && (
          <TouchableOpacity style={styles.startButton} onPress={startCall}>
            <Ionicons name="call" size={32} color="#fff" />
          </TouchableOpacity>
        )}

        {callState.currentPhase === 'talking' && (
          <View style={styles.callControls}>
            <TouchableOpacity
              style={[styles.controlButton, callState.isMuted && styles.activeControlButton]}
              onPress={toggleMute}
            >
              <Ionicons
                name={callState.isMuted ? "mic-off" : "mic"}
                size={28}
                color={callState.isMuted ? "#FF6B6B" : "#fff"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.endButton} onPress={endCall}>
              <Ionicons name="call" size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, callState.isSpeakerOn && styles.activeControlButton]}
              onPress={toggleSpeaker}
            >
              <Ionicons
                name={callState.isSpeakerOn ? "volume-high" : "volume-medium"}
                size={28}
                color={callState.isSpeakerOn ? "#4A90E2" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        )}

        {callState.currentPhase === 'ended' && (
          <View style={styles.endedContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            <Text style={styles.endedText}>通話練習完成！</Text>
            <Text style={styles.endedSubtext}>正在返回...</Text>
          </View>
        )}
      </View>

      {/* 練習提示 */}
      <View style={styles.tipsContainer}>
        <View style={styles.tipItem}>
          <Ionicons name="mic" size={16} color="#FFD700" />
          <Text style={styles.tipText}>保持自然的說話語調</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="heart" size={16} color="#FF6B6B" />
          <Text style={styles.tipText}>表現出真誠的興趣</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="time" size={16} color="#4A90E2" />
          <Text style={styles.tipText}>適當的停頓和回應</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 24,
  },
  contactName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    fontFamily: Fonts.rounded,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  callTimer: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  callStatus: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    position: 'relative',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    fontFamily: Fonts.rounded,
  },
  waveContainer: {
    position: 'absolute',
    bottom: -30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waveBar: {
    width: 6,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 3,
  },
  messageContainer: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
    marginBottom: 16,
  },
  aiTips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    maxWidth: width - 64,
  },
  aiTipsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  startButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  callControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeControlButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  endButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  endedContainer: {
    alignItems: 'center',
    gap: 16,
  },
  endedText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  endedSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  tipsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
})