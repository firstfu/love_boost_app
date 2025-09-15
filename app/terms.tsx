/**
 * 使用條款頁面
 * 詳細說明服務條款和使用協議
 */

import React from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Fonts } from '@/constants/theme'

interface SectionProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  children: React.ReactNode
  color?: string
}

const Section = ({ icon, title, children, color = '#64748B' }: SectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
)

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.paragraph}>{children}</Text>
)

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.listItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.listText}>{children}</Text>
  </View>
)

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      {/* 漸層背景頭部 */}
      <LinearGradient
        colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
        locations={[0, 0.4, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>使用條款</Text>
          <Text style={styles.subtitle}>請仔細閱讀以下使用條款</Text>
          <Text style={styles.lastUpdated}>最後更新：2024年9月16日</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 服務協議 */}
        <Section icon="document-text" title="服務協議" color="#0EA5E9">
          <Paragraph>
            歡迎使用 Love Boost（「本服務」、「我們」）。這些使用條款（「條款」）規範您對本應用程式和相關服務的使用。使用本服務即表示您同意受這些條款約束。
          </Paragraph>
          <Paragraph>
            如果您不同意這些條款，請勿使用本服務。我們保留隨時修改這些條款的權利，修改後的條款將在發布後立即生效。
          </Paragraph>
        </Section>

        {/* 服務描述 */}
        <Section icon="apps" title="服務描述" color="#8B5CF6">
          <Paragraph>Love Boost 是一款 AI 戀愛助手應用，提供以下服務：</Paragraph>
          <ListItem>基於用戶上傳內容創建 AI 分身</ListItem>
          <ListItem>模擬對話練習和建議</ListItem>
          <ListItem>聊天內容分析和個性洞察</ListItem>
          <ListItem>個人化的溝通技巧建議</ListItem>
          <Paragraph>
            本服務僅供娛樂和學習目的使用，不應作為專業關係諮詢或心理治療的替代品。
          </Paragraph>
        </Section>

        {/* 用戶責任 */}
        <Section icon="person-circle" title="用戶責任" color="#F59E0B">
          <Paragraph>使用本服務時，您同意：</Paragraph>
          <ListItem>提供準確且合法的個人資訊</ListItem>
          <ListItem>僅上傳您擁有權利的內容</ListItem>
          <ListItem>不上傳侵犯他人隱私或權利的內容</ListItem>
          <ListItem>不使用本服務進行任何非法活動</ListItem>
          <ListItem>尊重其他用戶的權利和隱私</ListItem>
          <ListItem>遵守所有適用的法律法規</ListItem>
        </Section>

        {/* 使用限制 */}
        <Section icon="ban" title="使用限制" color="#EF4444">
          <Paragraph>您不得：</Paragraph>
          <ListItem>上傳包含暴力、仇恨、歧視性內容</ListItem>
          <ListItem>上傳色情、裸體或性暗示內容</ListItem>
          <ListItem>嘗試逆向工程或破解本應用</ListItem>
          <ListItem>使用自動化工具濫用服務</ListItem>
          <ListItem>冒充他人或提供虛假資訊</ListItem>
          <ListItem>干擾或破壞服務的正常運作</ListItem>
          <ListItem>將服務用於商業用途（除非獲得授權）</ListItem>
        </Section>

        {/* 智慧財產權 */}
        <Section icon="library" title="智慧財產權" color="#10B981">
          <Paragraph>
            本應用程式及其所有內容（包括但不限於軟體、設計、文字、圖形、標誌）均受智慧財產權法保護，歸 Love Boost 或其授權方所有。
          </Paragraph>
          <Paragraph>
            您上傳的內容仍歸您所有，但您授予我們使用這些內容提供服務的必要權利。我們承諾僅在提供服務所需的範圍內使用您的內容。
          </Paragraph>
        </Section>

        {/* 付費服務 */}
        <Section icon="card" title="付費服務" color="#7C3AED">
          <Paragraph>本應用提供免費和付費功能：</Paragraph>

          <Text style={styles.subheading}>免費版本</Text>
          <ListItem>基本 AI 分身創建功能</ListItem>
          <ListItem>有限的對話練習次數</ListItem>
          <ListItem>基礎分析功能</ListItem>

          <Text style={styles.subheading}>付費版本</Text>
          <ListItem>無限制使用所有功能</ListItem>
          <ListItem>更高級的 AI 分析</ListItem>
          <ListItem>優先客戶支援</ListItem>

          <Text style={styles.subheading}>付款條款</Text>
          <Paragraph>
            付費訂閱將自動續訂，除非您在當前計費週期結束前至少24小時取消。您可以在帳戶設定中管理訂閱。
          </Paragraph>
        </Section>

        {/* 隱私和資料 */}
        <Section icon="shield-checkmark" title="隱私和資料" color="#059669">
          <Paragraph>
            我們非常重視您的隱私。有關我們如何收集、使用和保護您的資料的詳細資訊，請參閱我們的隱私權政策。
          </Paragraph>
          <Paragraph>
            您的個人資料將僅用於提供服務，不會在未經您同意的情況下與第三方分享（法律要求除外）。
          </Paragraph>
        </Section>

        {/* 服務可用性 */}
        <Section icon="cloud" title="服務可用性" color="#0891B2">
          <Paragraph>
            我們努力確保服務的穩定性，但不保證服務100%可用。服務可能因維護、升級或不可抗力因素而暫時中斷。
          </Paragraph>
          <Paragraph>
            我們保留隨時修改、暫停或終止服務的權利，並會盡力提前通知用戶。
          </Paragraph>
        </Section>

        {/* 免責聲明 */}
        <Section icon="warning" title="免責聲明" color="#DC2626">
          <Paragraph>
            本服務按「現狀」提供，不提供任何明示或暗示的保證。我們不保證：
          </Paragraph>
          <ListItem>服務將滿足您的特定需求</ListItem>
          <ListItem>服務將不間斷或無錯誤</ListItem>
          <ListItem>AI 分析結果的準確性</ListItem>
          <ListItem>通過服務獲得的建議的有效性</ListItem>

          <Paragraph>
            在法律允許的最大範圍內，我們不承擔因使用本服務而產生的任何間接、附帶或後果性損害的責任。
          </Paragraph>
        </Section>

        {/* 帳戶終止 */}
        <Section icon="log-out" title="帳戶終止" color="#BE185D">
          <Paragraph>
            您可以隨時刪除您的帳戶。我們也保留在以下情況下暫停或終止您帳戶的權利：
          </Paragraph>
          <ListItem>違反這些使用條款</ListItem>
          <ListItem>從事欺詐或非法活動</ListItem>
          <ListItem>濫用服務或影響其他用戶</ListItem>
          <ListItem>長期不活躍</ListItem>

          <Paragraph>
            帳戶終止後，您對服務的存取權限將立即停止，相關資料將按照我們的資料保留政策處理。
          </Paragraph>
        </Section>

        {/* 爭議解決 */}
        <Section icon="balance" title="爭議解決" color="#9333EA">
          <Paragraph>
            這些條款受中華民國法律管轄。因本服務產生的任何爭議應首先通過友好協商解決。
          </Paragraph>
          <Paragraph>
            如果協商無法解決爭議，雙方同意將爭議提交台北地方法院管轄。
          </Paragraph>
        </Section>

        {/* 條款修改 */}
        <Section icon="refresh" title="條款修改" color="#0D9488">
          <Paragraph>
            我們可能會不時更新這些使用條款。重大變更將通過應用內通知或電子郵件告知您。繼續使用服務即表示您接受修改後的條款。
          </Paragraph>
        </Section>

        {/* 聯絡資訊 */}
        <Section icon="mail" title="聯絡我們" color="#7C2D12">
          <Paragraph>
            如果您對這些使用條款有任何疑問，請聯絡我們：
          </Paragraph>

          <Text style={styles.contactInfo}>電子郵件：legal@loveboost.com</Text>
          <Text style={styles.contactInfo}>地址：台北市信義區信義路五段7號</Text>
          <Text style={styles.contactInfo}>電話：+886-2-1234-5678</Text>

          <Paragraph>
            感謝您使用 Love Boost！我們致力於為您提供最佳的服務體驗。
          </Paragraph>
        </Section>

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
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    fontFamily: Fonts.rounded,
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paragraph: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a202c',
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
    marginTop: 1,
  },
  listText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 18,
    flex: 1,
  },
  contactInfo: {
    fontSize: 14,
    color: '#0EA5E9',
    lineHeight: 20,
    marginBottom: 4,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 80,
  },
})