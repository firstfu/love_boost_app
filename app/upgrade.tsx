/**
 * 升級方案頁面
 * 提供不同會員等級的功能介紹和升級選項
 */

import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useUserStore, MembershipPlan } from '@/src/stores/userStore'
import { Fonts } from '@/constants/theme'

interface PlanFeature {
  text: string
  included: boolean
}

interface PricingPlan {
  id: MembershipPlan
  name: string
  price: string
  period: string
  description: string
  features: PlanFeature[]
  buttonText: string
  isPopular?: boolean
  color: string
  gradientColors: string[]
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '免費版',
    price: '$0',
    period: '永久免費',
    description: '體驗基本功能',
    features: [
      { text: '每日3次對話練習', included: true },
      { text: '基本愛情建議', included: true },
      { text: '標準回應速度', included: true },
      { text: '進階分析功能', included: false },
      { text: '無限對話次數', included: false },
      { text: '專屬客服支援', included: false },
    ],
    buttonText: '當前方案',
    color: '#8E8E93',
    gradientColors: ['#F5F5F5', '#E5E5EA'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: '每月',
    description: '解鎖所有進階功能',
    features: [
      { text: '無限對話練習', included: true },
      { text: '進階愛情分析', included: true },
      { text: '快速回應速度', included: true },
      { text: '個人化建議', included: true },
      { text: '對話記錄備份', included: true },
      { text: '優先客服支援', included: true },
    ],
    buttonText: '立即升級',
    isPopular: true,
    color: '#FFD700',
    gradientColors: ['#FFD700', '#FFA500'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$19.99',
    period: '每月',
    description: '企業級功能與支援',
    features: [
      { text: '所有Premium功能', included: true },
      { text: '多帳戶管理', included: true },
      { text: '數據分析報告', included: true },
      { text: 'API訪問權限', included: true },
      { text: '專屬客戶經理', included: true },
      { text: '24/7技術支援', included: true },
    ],
    buttonText: '聯絡銷售',
    color: '#8A2BE2',
    gradientColors: ['#8A2BE2', '#9370DB'],
  },
]

const FeatureItem = ({ feature }: { feature: PlanFeature }) => (
  <View style={styles.featureItem}>
    <Ionicons
      name={feature.included ? 'checkmark-circle' : 'close-circle'}
      size={16}
      color={feature.included ? '#10B981' : '#E5E5EA'}
    />
    <Text style={[
      styles.featureText,
      { color: feature.included ? '#1F2937' : '#9CA3AF' }
    ]}>
      {feature.text}
    </Text>
  </View>
)

const PlanCard = ({ plan, currentPlan, onSelect }: {
  plan: PricingPlan
  currentPlan: MembershipPlan
  onSelect: (planId: MembershipPlan) => void
}) => {
  const isCurrentPlan = plan.id === currentPlan
  const isDowngrade = currentPlan === 'enterprise' && plan.id === 'premium'

  return (
    <View style={[
      styles.planCard,
      plan.isPopular && styles.popularCard,
      isCurrentPlan && styles.currentPlanCard
    ]}>
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>最受歡迎</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>/{plan.period}</Text>
        </View>
        <Text style={styles.planDescription}>{plan.description}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.selectButton,
          isCurrentPlan && styles.currentPlanButton,
          { backgroundColor: plan.color }
        ]}
        onPress={() => onSelect(plan.id)}
        disabled={isCurrentPlan}
      >
        <Text style={[
          styles.selectButtonText,
          isCurrentPlan && styles.currentPlanButtonText
        ]}>
          {isCurrentPlan ? '當前方案' : isDowngrade ? '降級' : plan.buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default function UpgradeScreen() {
  const { user, upgradeMembership } = useUserStore()

  const currentPlan = user?.membershipPlan || 'free'

  const handlePlanSelect = async (planId: MembershipPlan) => {
    if (planId === currentPlan) return

    try {
      if (planId === 'free') {
        // 處理降級到免費版
        Alert.alert(
          '確認降級',
          '您確定要降級到免費版嗎？這將限制您的功能使用。',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '確認降級',
              style: 'destructive',
              onPress: () => {
                upgradeMembership(planId)
                Alert.alert('成功', '已降級到免費版')
              }
            }
          ]
        )
      } else if (planId === 'enterprise') {
        // 企業版需要聯絡銷售
        Alert.alert(
          '聯絡銷售',
          '企業版需要客製化方案，我們將為您安排專屬客戶經理聯絡。',
          [
            { text: '取消', style: 'cancel' },
            {
              text: '聯絡我們',
              onPress: () => {
                // 這裡可以實作跳轉到聯絡表單或客服
                Alert.alert('提示', '感謝您的興趣！我們將在24小時內聯絡您。')
              }
            }
          ]
        )
      } else {
        // Premium升級
        Alert.alert(
          '升級確認',
          `您將升級到${pricingPlans.find(p => p.id === planId)?.name}方案。是否繼續？`,
          [
            { text: '取消', style: 'cancel' },
            {
              text: '確認升級',
              onPress: () => {
                // 實際的付款流程應該在這裡實作
                const expiry = new Date()
                expiry.setMonth(expiry.getMonth() + 1)
                upgradeMembership(planId, expiry)
                Alert.alert('升級成功', '恭喜您升級成功！現在可以享受所有進階功能。')
                router.back()
              }
            }
          ]
        )
      }
    } catch (error) {
      Alert.alert('錯誤', '升級過程中發生錯誤，請稍後再試。')
    }
  }

  return (
    <View style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 當前方案狀態 */}
        <View style={styles.currentStatusContainer}>
          <View style={styles.statusCard}>
            <Ionicons name="diamond" size={24} color="#FFD700" />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>當前方案</Text>
              <Text style={styles.statusPlan}>
                {pricingPlans.find(p => p.id === currentPlan)?.name || '免費版'}
              </Text>
            </View>
          </View>
        </View>

        {/* 方案卡片 */}
        <View style={styles.plansContainer}>
          {pricingPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={currentPlan}
              onSelect={handlePlanSelect}
            />
          ))}
        </View>

        {/* 常見問題 */}
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>常見問題</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>可以隨時取消訂閱嗎？</Text>
            <Text style={styles.faqAnswer}>是的，您可以隨時在設定中取消訂閱，取消後會在當前計費週期結束時生效。</Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>升級後立即生效嗎？</Text>
            <Text style={styles.faqAnswer}>是的，升級後所有功能會立即解鎖，您可以馬上開始使用。</Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>如何聯絡客服？</Text>
            <Text style={styles.faqAnswer}>您可以透過「我的」頁面中的「聯絡支援」功能與我們聯絡。</Text>
          </View>
        </View>

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
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  currentStatusContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusText: {
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusPlan: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '700',
    fontFamily: Fonts.rounded,
  },
  plansContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularCard: {
    borderColor: '#FFD700',
    transform: [{ scale: 1.02 }],
  },
  currentPlanCard: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: Fonts.rounded,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1F2937',
    fontFamily: Fonts.rounded,
  },
  period: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  selectButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPlanButton: {
    backgroundColor: '#10B981',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  currentPlanButtonText: {
    color: '#fff',
  },
  faqContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: Fonts.rounded,
  },
  faqItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 80,
  },
})