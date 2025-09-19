/**
 * 使用指南頁面
 * 提供應用使用教學和常見問題解答
 */

import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Fonts } from '@/constants/theme'

interface GuideItemProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  onPress: () => void
  color?: string
}

const GuideItem = ({ icon, title, description, onPress, color = '#059669' }: GuideItemProps) => (
  <TouchableOpacity style={styles.guideItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.guideContent}>
      <Text style={styles.guideTitle}>{title}</Text>
      <Text style={styles.guideDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
  </TouchableOpacity>
)

interface FAQItemProps {
  question: string
  answer: string
  isExpanded: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isExpanded, onToggle }: FAQItemProps) => (
  <TouchableOpacity style={styles.faqItem} onPress={onToggle}>
    <View style={styles.faqHeader}>
      <Text style={styles.faqQuestion}>{question}</Text>
      <Ionicons
        name={isExpanded ? "chevron-up" : "chevron-down"}
        size={16}
        color="#8E8E93"
      />
    </View>
    {isExpanded && (
      <Text style={styles.faqAnswer}>{answer}</Text>
    )}
  </TouchableOpacity>
)

export default function GuideScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const faqData = [
    {
      question: "如何創建新的AI分身？",
      answer: "在首頁點擊「建立新助手」按鈕，然後上傳她的照片和對話記錄，AI會自動分析並創建專屬的分身助手。"
    },
    {
      question: "AI分身的準確度如何？",
      answer: "AI分身的準確度取決於提供的資料質量和數量。建議上傳多張照片和豐富的對話記錄，這樣AI能更好地學習她的個性和說話風格。"
    },
    {
      question: "對話練習有什麼用？",
      answer: "對話練習可以幫助您模擬真實對話情境，提升聊天技巧，並獲得AI的建議和指導，讓您在真實對話中更有信心。"
    },
    {
      question: "快速分析功能如何使用？",
      answer: "上傳聊天截圖或輸入對話內容，AI會分析對方的回應模式、情緒狀態，並提供個人化的聊天建議。"
    },
    {
      question: "如何提升AI分析的準確性？",
      answer: "定期更新她的資料，包括新的照片、對話記錄，並在使用過程中給予反饋，AI會持續學習和改進。"
    },
    {
      question: "資料安全嗎？",
      answer: "我們採用企業級加密技術保護您的資料，絕不會洩露或分享給第三方。您也可以隨時刪除或匯出您的資料。"
    },
    {
      question: "免費版有什麼限制？",
      answer: "免費版可以創建1個AI分身，每日有限制的API使用量。升級到付費版可以解鎖更多功能和無限制使用。"
    },
    {
      question: "如何升級到付費版？",
      answer: "在「我的」頁面點擊「升級方案」，選擇適合的方案並完成付款即可立即升級。"
    }
  ]

  const handleQuickStart = () => {
    Alert.alert(
      "快速開始",
      "1. 點擊「建立新助手」\n2. 上傳她的照片\n3. 輸入對話記錄\n4. 開始對話練習\n\n就是這麼簡單！"
    )
  }

  const handleFeatureIntro = () => {
    Alert.alert(
      "功能介紹",
      "🎭 AI分身創建：基於真實資料創建個性化AI助手\n\n💬 對話練習：模擬真實聊天情境，提升溝通技巧\n\n⚡ 快速分析：即時分析對話內容，提供聊天建議\n\n📊 個性洞察：深度了解她的個性和喜好"
    )
  }

  const handleTips = () => {
    Alert.alert(
      "使用技巧",
      "💡 上傳高質量照片能提升分析準確度\n\n📝 提供豐富的對話記錄有助於AI學習\n\n🔄 定期更新資料保持AI分身的時效性\n\n⭐ 多使用對話練習功能提升聊天技巧\n\n🎯 關注AI建議並在實際對話中應用"
    )
  }

  const handleVideoTutorial = () => {
    Alert.alert("視頻教程", "視頻教程功能即將推出，敬請期待！")
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScrollContainer} showsVerticalScrollIndicator={false}>
        {/* 快速指南 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快速開始</Text>

          <GuideItem
            icon="rocket"
            title="新手指南"
            description="3分鐘快速上手，開始您的第一次AI對話"
            onPress={handleQuickStart}
            color="#FF6B9D"
          />

          <GuideItem
            icon="library"
            title="功能介紹"
            description="詳細了解所有功能和使用方法"
            onPress={handleFeatureIntro}
            color="#8B5CF6"
          />

          <GuideItem
            icon="bulb"
            title="使用技巧"
            description="專家建議，讓您的聊天技巧突飛猛進"
            onPress={handleTips}
            color="#F59E0B"
          />

          <GuideItem
            icon="play-circle"
            title="視頻教程"
            description="觀看詳細視頻教學，輕鬆掌握所有功能"
            onPress={handleVideoTutorial}
            color="#EF4444"
          />
        </View>

        {/* 功能詳解 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>功能詳解</Text>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Ionicons name="people" size={20} color="#FF6B9D" />
              <Text style={styles.featureTitle}>AI分身創建</Text>
            </View>
            <Text style={styles.featureDescription}>
              上傳她的照片和對話記錄，AI會深度分析她的外表特徵、說話風格、個性特點，創建專屬的AI分身助手。
            </Text>
            <View style={styles.featureSteps}>
              <Text style={styles.stepText}>• 上傳1-5張清晰照片</Text>
              <Text style={styles.stepText}>• 提供豐富的對話記錄</Text>
              <Text style={styles.stepText}>• AI自動分析並創建分身</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Ionicons name="chatbubbles" size={20} color="#8B5CF6" />
              <Text style={styles.featureTitle}>對話練習</Text>
            </View>
            <Text style={styles.featureDescription}>
              與AI分身進行模擬對話，練習不同場景下的聊天技巧，獲得實時建議和指導。
            </Text>
            <View style={styles.featureSteps}>
              <Text style={styles.stepText}>• 選擇對話場景</Text>
              <Text style={styles.stepText}>• 開始模擬對話</Text>
              <Text style={styles.stepText}>• 獲得AI建議和評分</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Ionicons name="flash" size={20} color="#F59E0B" />
              <Text style={styles.featureTitle}>快速分析</Text>
            </View>
            <Text style={styles.featureDescription}>
              上傳聊天截圖或輸入對話內容，AI會即時分析對方的情緒、態度，並提供個人化建議。
            </Text>
            <View style={styles.featureSteps}>
              <Text style={styles.stepText}>• 上傳聊天截圖</Text>
              <Text style={styles.stepText}>• AI分析對話內容</Text>
              <Text style={styles.stepText}>• 獲得聊天建議</Text>
            </View>
          </View>
        </View>

        {/* 常見問題 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常見問題</Text>

          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isExpanded={expandedFAQ === index}
              onToggle={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
            />
          ))}
        </View>

        {/* 底部空間 */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainScrollContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    color: '#1a202c',
    fontFamily: Fonts.rounded,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  featureDescription: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  featureSteps: {
    gap: 4,
  },
  stepText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  faqItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#4a5568',
    lineHeight: 18,
    marginTop: 8,
    paddingLeft: 8,
  },
  bottomSpace: {
    height: 80,
  },
})