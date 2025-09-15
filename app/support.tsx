/**
 * 聯絡支援頁面
 * 提供問題回報、意見反饋和客服聯絡功能
 */

import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Linking } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Fonts } from '@/constants/theme'

interface ContactMethodProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  value: string
  onPress: () => void
  color?: string
}

const ContactMethod = ({ icon, title, description, value, onPress, color = '#0EA5E9' }: ContactMethodProps) => (
  <TouchableOpacity style={styles.contactMethod} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.contactContent}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactDescription}>{description}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
  </TouchableOpacity>
)

interface ProblemCategoryProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  isSelected: boolean
  onPress: () => void
  color?: string
}

const ProblemCategory = ({ icon, title, description, isSelected, onPress, color = '#64748B' }: ProblemCategoryProps) => (
  <TouchableOpacity
    style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
    onPress={onPress}
  >
    <View style={[styles.categoryIcon, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.categoryContent}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categoryDescription}>{description}</Text>
    </View>
    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#FF6B9D" />}
  </TouchableOpacity>
)

export default function SupportScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [problemDescription, setProblemDescription] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const problemCategories = [
    {
      id: 'technical',
      icon: 'bug' as keyof typeof Ionicons.glyphMap,
      title: '技術問題',
      description: '應用崩潰、功能異常、載入問題',
      color: '#EF4444'
    },
    {
      id: 'account',
      icon: 'person-circle' as keyof typeof Ionicons.glyphMap,
      title: '帳號問題',
      description: '登入困難、密碼重設、帳號管理',
      color: '#8B5CF6'
    },
    {
      id: 'payment',
      icon: 'card' as keyof typeof Ionicons.glyphMap,
      title: '付費問題',
      description: '升級失敗、退款申請、帳單查詢',
      color: '#F59E0B'
    },
    {
      id: 'feature',
      icon: 'bulb' as keyof typeof Ionicons.glyphMap,
      title: '功能建議',
      description: '新功能建議、改進意見、使用體驗',
      color: '#10B981'
    },
    {
      id: 'other',
      icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
      title: '其他問題',
      description: '隱私政策、使用條款、一般諮詢',
      color: '#6B7280'
    }
  ]

  const handleEmailContact = () => {
    const subject = encodeURIComponent('Love Boost App 支援請求')
    const body = encodeURIComponent(`問題類別: ${selectedCategory ? problemCategories.find(c => c.id === selectedCategory)?.title : '未選擇'}\n\n問題描述:\n${problemDescription}\n\n---\n請詳細描述您遇到的問題，我們會盡快回覆您。`)

    Linking.openURL(`mailto:support@loveboost.com?subject=${subject}&body=${body}`)
  }

  const handlePhoneContact = () => {
    Alert.alert(
      '電話支援',
      '客服專線：+886-2-1234-5678\n服務時間：週一至週五 9:00-18:00',
      [
        { text: '撥打電話', onPress: () => Linking.openURL('tel:+886212345678') },
        { text: '取消', style: 'cancel' }
      ]
    )
  }

  const handleChatSupport = () => {
    Alert.alert('線上客服', '線上客服功能即將推出，目前請使用電子郵件聯絡我們。')
  }

  const handleSubmitReport = () => {
    if (!selectedCategory) {
      Alert.alert('提示', '請選擇問題類別')
      return
    }

    if (!problemDescription.trim()) {
      Alert.alert('提示', '請描述您遇到的問題')
      return
    }

    if (!userEmail.trim()) {
      Alert.alert('提示', '請輸入您的聯絡信箱')
      return
    }

    Alert.alert(
      '提交成功',
      '您的問題已成功提交，我們會在24小時內回覆到您的信箱。',
      [
        { text: '確定', onPress: () => {
          setSelectedCategory('')
          setProblemDescription('')
          setUserEmail('')
        }}
      ]
    )
  }

  const handleQuickAnswer = (question: string, answer: string) => {
    Alert.alert(question, answer)
  }

  return (
    <View style={styles.container}>
      {/* 漸層背景頭部 */}
      <LinearGradient
        colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
        locations={[0, 0.4, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>聯絡支援</Text>
          <Text style={styles.subtitle}>我們隨時為您提供協助</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 聯絡方式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>聯絡方式</Text>

          <ContactMethod
            icon="mail"
            title="電子郵件"
            description="發送詳細問題描述，24小時內回覆"
            value="support@loveboost.com"
            onPress={handleEmailContact}
            color="#0EA5E9"
          />

          <ContactMethod
            icon="call"
            title="客服專線"
            description="週一至週五 9:00-18:00"
            value="+886-2-1234-5678"
            onPress={handlePhoneContact}
            color="#10B981"
          />

          <ContactMethod
            icon="chatbubbles"
            title="線上客服"
            description="即時聊天支援（即將推出）"
            value="線上客服"
            onPress={handleChatSupport}
            color="#8B5CF6"
          />
        </View>

        {/* 問題回報表單 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>問題回報</Text>

          <Text style={styles.formLabel}>問題類別</Text>
          <View style={styles.categoriesContainer}>
            {problemCategories.map((category) => (
              <ProblemCategory
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                isSelected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
                color={category.color}
              />
            ))}
          </View>

          <Text style={styles.formLabel}>問題描述</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            placeholder="請詳細描述您遇到的問題..."
            value={problemDescription}
            onChangeText={setProblemDescription}
            textAlignVertical="top"
          />

          <Text style={styles.formLabel}>聯絡信箱</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="your.email@example.com"
            value={userEmail}
            onChangeText={setUserEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReport}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>提交問題</Text>
          </TouchableOpacity>
        </View>

        {/* 常見問題快速解答 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常見問題</Text>

          <TouchableOpacity
            style={styles.quickAnswerItem}
            onPress={() => handleQuickAnswer(
              '忘記密碼怎麼辦？',
              '請點擊登入頁面的「忘記密碼」連結，輸入您的信箱地址，我們會發送重設密碼的連結到您的信箱。'
            )}
          >
            <Text style={styles.quickAnswerText}>忘記密碼怎麼辦？</Text>
            <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAnswerItem}
            onPress={() => handleQuickAnswer(
              '如何升級到付費版？',
              '在「我的」頁面點擊「升級方案」，選擇適合的方案並完成付款即可。支援信用卡、Apple Pay 等多種付款方式。'
            )}
          >
            <Text style={styles.quickAnswerText}>如何升級到付費版？</Text>
            <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAnswerItem}
            onPress={() => handleQuickAnswer(
              'AI分析不準確怎麼辦？',
              '請確保提供高質量的照片和豐富的對話記錄。您也可以在分析結果頁面提供反饋，幫助AI不斷改進。'
            )}
          >
            <Text style={styles.quickAnswerText}>AI分析不準確怎麼辦？</Text>
            <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAnswerItem}
            onPress={() => handleQuickAnswer(
              '可以刪除我的資料嗎？',
              '可以。在「設定」頁面點擊「刪除帳號」即可永久刪除所有資料。您也可以選擇「匯出資料」先備份資料。'
            )}
          >
            <Text style={styles.quickAnswerText}>可以刪除我的資料嗎？</Text>
            <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>
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
    backgroundColor: '#ffffff',
  },
  backgroundGradient: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.rounded,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    marginTop: -10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
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
  contactMethod: {
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
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '500',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  categoryItemSelected: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF0F5',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    backgroundColor: '#FAFAFA',
    fontSize: 14,
    minHeight: 100,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 20,
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#FF6B9D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickAnswerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  quickAnswerText: {
    fontSize: 14,
    color: '#1a202c',
    fontWeight: '500',
    flex: 1,
  },
  bottomSpace: {
    height: 80,
  },
})