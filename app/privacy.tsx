/**
 * 隱私權政策頁面
 * 詳細說明數據收集、使用和保護政策
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

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      {/* 漸層背景頭部 */}
      <LinearGradient
        colors={['#FF7BA7', '#FF87B2', '#FF96C0']}
        locations={[0, 0.4, 1]}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>隱私權政策</Text>
          <Text style={styles.subtitle}>保護您的隱私是我們的首要任務</Text>
          <Text style={styles.lastUpdated}>最後更新：2024年9月16日</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 政策概述 */}
        <Section icon="shield-checkmark" title="政策概述" color="#10B981">
          <Paragraph>
            Love Boost（「我們」、「本應用」）非常重視您的隱私權。本隱私權政策說明我們如何收集、使用、儲存和保護您的個人資訊。使用本應用即表示您同意本政策的內容。
          </Paragraph>
        </Section>

        {/* 資料收集 */}
        <Section icon="folder-open" title="我們收集的資料" color="#0EA5E9">
          <Paragraph>我們可能收集以下類型的資料：</Paragraph>

          <Text style={styles.subheading}>個人識別資訊</Text>
          <ListItem>用戶名稱、電子郵件地址</ListItem>
          <ListItem>個人資料照片（您主動上傳的）</ListItem>
          <ListItem>帳戶偏好設定</ListItem>

          <Text style={styles.subheading}>使用資料</Text>
          <ListItem>對話記錄和分析結果</ListItem>
          <ListItem>應用使用統計和行為數據</ListItem>
          <ListItem>設備資訊（型號、作業系統版本）</ListItem>

          <Text style={styles.subheading}>技術資料</Text>
          <ListItem>IP 位址、設備識別碼</ListItem>
          <ListItem>日誌檔案和錯誤報告</ListItem>
          <ListItem>應用效能和使用情況</ListItem>
        </Section>

        {/* 資料使用 */}
        <Section icon="settings" title="資料使用方式" color="#8B5CF6">
          <Paragraph>我們使用收集的資料用於：</Paragraph>

          <ListItem>提供和改善 AI 分身服務</ListItem>
          <ListItem>個性化您的使用體驗</ListItem>
          <ListItem>分析和優化應用效能</ListItem>
          <ListItem>提供客戶支援服務</ListItem>
          <ListItem>發送重要通知和更新</ListItem>
          <ListItem>防止詐欺和濫用行為</ListItem>
          <ListItem>遵守法律義務</ListItem>
        </Section>

        {/* 資料分享 */}
        <Section icon="people" title="資料分享" color="#F59E0B">
          <Paragraph>我們不會出售您的個人資料。我們僅在以下情況下分享資料：</Paragraph>

          <Text style={styles.subheading}>服務提供商</Text>
          <Paragraph>
            我們可能與協助我們提供服務的第三方分享資料，包括雲端儲存、分析和客戶支援服務提供商。這些合作夥伴受到嚴格的保密協議約束。
          </Paragraph>

          <Text style={styles.subheading}>法律要求</Text>
          <Paragraph>
            在法律要求或為保護我們的權利、財產或安全時，我們可能會披露您的資料。
          </Paragraph>

          <Text style={styles.subheading}>業務轉讓</Text>
          <Paragraph>
            在合併、收購或資產出售的情況下，您的資料可能會轉移給新的實體。
          </Paragraph>
        </Section>

        {/* 資料保護 */}
        <Section icon="lock-closed" title="資料保護措施" color="#EF4444">
          <Paragraph>我們採用業界標準的安全措施保護您的資料：</Paragraph>

          <ListItem>資料傳輸和儲存加密</ListItem>
          <ListItem>安全的伺服器和資料中心</ListItem>
          <ListItem>定期安全稽核和漏洞測試</ListItem>
          <ListItem>員工資料存取權限控制</ListItem>
          <ListItem>自動備份和災難恢復機制</ListItem>
        </Section>

        {/* 您的權利 */}
        <Section icon="person-circle" title="您的權利" color="#7C3AED">
          <Paragraph>您對個人資料擁有以下權利：</Paragraph>

          <Text style={styles.subheading}>存取權</Text>
          <Paragraph>您有權要求查看我們持有的關於您的個人資料。</Paragraph>

          <Text style={styles.subheading}>更正權</Text>
          <Paragraph>您可以要求更正不準確或不完整的個人資料。</Paragraph>

          <Text style={styles.subheading}>刪除權</Text>
          <Paragraph>您可以要求刪除您的個人資料（「被遺忘權」）。</Paragraph>

          <Text style={styles.subheading}>資料可攜權</Text>
          <Paragraph>您可以要求以結構化、常用的機器可讀格式接收您的資料。</Paragraph>

          <Text style={styles.subheading}>反對權</Text>
          <Paragraph>您可以反對我們處理您的個人資料用於特定目的。</Paragraph>
        </Section>

        {/* 資料保留 */}
        <Section icon="time" title="資料保留" color="#059669">
          <Paragraph>我們僅在必要期間保留您的資料：</Paragraph>

          <ListItem>帳戶資料：帳戶存續期間</ListItem>
          <ListItem>對話記錄：最多保留 2 年</ListItem>
          <ListItem>分析資料：匿名化後保留用於改善服務</ListItem>
          <ListItem>日誌檔案：最多保留 90 天</ListItem>
        </Section>

        {/* 兒童隱私 */}
        <Section icon="school" title="兒童隱私" color="#DB2777">
          <Paragraph>
            本應用不適用於 13 歲以下的兒童。我們不會故意收集 13 歲以下兒童的個人資料。如果我們發現收集了此類資料，將立即刪除。
          </Paragraph>
        </Section>

        {/* 國際傳輸 */}
        <Section icon="globe" title="國際資料傳輸" color="#0891B2">
          <Paragraph>
            您的資料可能會傳輸至您所在國家/地區以外的地方進行處理。我們確保此類傳輸符合適用的資料保護法律，並採取適當的保護措施。
          </Paragraph>
        </Section>

        {/* 政策更新 */}
        <Section icon="refresh" title="政策更新" color="#DC2626">
          <Paragraph>
            我們可能會不時更新本隱私權政策。重大變更將透過應用內通知或電子郵件通知您。請定期查看本政策以了解最新資訊。
          </Paragraph>
        </Section>

        {/* 聯絡我們 */}
        <Section icon="mail" title="聯絡我們" color="#9333EA">
          <Paragraph>
            如果您對本隱私權政策有任何疑問或需要行使您的權利，請聯絡我們：
          </Paragraph>

          <Text style={styles.contactInfo}>電子郵件：privacy@loveboost.com</Text>
          <Text style={styles.contactInfo}>地址：台北市信義區信義路五段7號</Text>
          <Text style={styles.contactInfo}>電話：+886-2-1234-5678</Text>
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