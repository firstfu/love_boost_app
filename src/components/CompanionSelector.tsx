/**
 * AI分身選擇器
 * 展示不同個性的女生AI分身，讓用戶選擇想要練習對話的目標
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DEFAULT_COMPANIONS } from "../data/defaultCompanions";
import { useCompanionStore } from "../stores/assistantStore";
import { AICompanion } from "../types/assistant";
import { DefaultAvatar } from "./DefaultAvatar";
import { CreateCompanionModal } from "./CreateCompanionModal";


interface CompanionSelectorProps {
  onSelectCompanion: (companion: AICompanion) => void;
  onViewProfile: (companion: AICompanion) => void;
  onCreateCompanion: (companion: AICompanion) => void;
  onQuickAnalysis?: (companion: AICompanion) => void;
}

export const CompanionSelector: React.FC<CompanionSelectorProps> = ({ onSelectCompanion, onViewProfile, onCreateCompanion, onQuickAnalysis }) => {
  const [companions, setCompanions] = useState<AICompanion[]>([]);
  const [cardAnimations, setCardAnimations] = useState<Animated.Value[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [longPressAnimations, setLongPressAnimations] = useState<Animated.Value[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const { setCompanions: setStoreCompanions } = useCompanionStore();

  useEffect(() => {
    // 初始化AI分身數據
    const filteredCompanions = DEFAULT_COMPANIONS;

    setCompanions(filteredCompanions);
    setStoreCompanions(filteredCompanions);

    // 重新初始化動畫數組
    setCardAnimations(filteredCompanions.map(() => new Animated.Value(1)));
    setLongPressAnimations(filteredCompanions.map(() => new Animated.Value(1)));

    // 初始動畫
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, setStoreCompanions]);

  // 處理卡片點擊
  const handleCardPress = (companion: AICompanion, index: number) => {
    // 添加點擊動畫 - 更細綻的縮放效果
    if (cardAnimations[index]) {
      Animated.sequence([
        Animated.timing(cardAnimations[index], {
          toValue: 0.96,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnimations[index], {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // 添加點擊反饋
    // TODO: 可以添加震動效果

    onViewProfile(companion);
  };


  return (
    <View style={styles.container}>
      {/* 漸層背景 */}
      <LinearGradient colors={["#FF7BA7", "#FF87B2", "#FF96C0"]} locations={[0, 0.4, 1]} style={styles.backgroundGradient}>
        {/* 頂部標題區 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>她的AI分身</Text>
            <Text style={styles.subtitle}>上傳她的資料，讓AI幫你更了解她</Text>

            {/* 顯眼的新增按鈕 */}
            <TouchableOpacity style={styles.createButtonTop} onPress={() => setIsCreateModalVisible(true)}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.createButtonTopText}>建立新助手</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>


      {/* AI分身卡片列表 */}
      <Animated.View
        style={[
          styles.companionListContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView style={styles.companionList} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {companions.map((companion, index) => {
            const animation = cardAnimations[index] || new Animated.Value(1);

            return (
              <Animated.View
                key={companion.id}
                style={[
                  styles.companionCard,
                  {
                    transform: [{ scale: animation }],
                    opacity: fadeAnim,
                  },
                ]}
              >
                <TouchableOpacity activeOpacity={0.95} onPress={() => handleCardPress(companion, index)} style={styles.cardTouchable}>
                  {/* 卡片內容 - 橫向佈局 */}
                  <View style={styles.cardContentHorizontal}>
                    {/* 左側頭像區域 */}
                    <View style={styles.leftSection}>
                      <View style={styles.avatarWrapperHorizontal}>
                        <DefaultAvatar gender={companion.gender} size={80} realAvatar={companion.realAvatar} />
                      </View>
                    </View>

                    {/* 右側資訊區域 */}
                    <View style={styles.rightSection}>
                      {/* 頭部資訊 */}
                      <View style={styles.headerInfo}>
                        <View style={styles.nameAgeRow}>
                          <Text style={styles.nameHorizontal}>{companion.name}</Text>
                          <View style={styles.ageTagHorizontal}>
                            <Text style={styles.ageTagHorizontalText}>{companion.age}</Text>
                          </View>
                        </View>

                        {/* 更多按鈕 - 使用 settings 圖標更直觀 */}
                        <Link href="/">
                          <Link.Trigger>
                            <TouchableOpacity
                              style={styles.moreButtonHorizontal}
                              onPressIn={() => {
                                // 長按開始時的動畫和震動反饋
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                if (longPressAnimations[index]) {
                                  Animated.loop(
                                    Animated.sequence([
                                      Animated.timing(longPressAnimations[index], {
                                        toValue: 1.2,
                                        duration: 500,
                                        useNativeDriver: true,
                                      }),
                                      Animated.timing(longPressAnimations[index], {
                                        toValue: 1,
                                        duration: 500,
                                        useNativeDriver: true,
                                      }),
                                    ])
                                  ).start();
                                }
                              }}
                              onPressOut={() => {
                                // 停止動畫
                                if (longPressAnimations[index]) {
                                  longPressAnimations[index].stopAnimation();
                                  Animated.timing(longPressAnimations[index], {
                                    toValue: 1,
                                    duration: 200,
                                    useNativeDriver: true,
                                  }).start();
                                }
                              }}
                            >
                              <Animated.View
                                style={{
                                  transform: [{ scale: longPressAnimations[index] || 1 }],
                                }}
                              >
                                <Ionicons name="options-outline" size={20} color="#6B7280" />
                              </Animated.View>
                            </TouchableOpacity>
                          </Link.Trigger>
                          <Link.Menu>
                            <Link.MenuAction
                              title="建立副本"
                              icon="doc.on.doc"
                              onPress={() => {
                                console.log("建立", companion.name, "的副本");
                              }}
                            />
                            <Link.MenuAction
                              title="刪除"
                              icon="trash"
                              destructive
                              onPress={() => {
                                console.log("刪除AI助手:", companion.id);
                              }}
                            />
                          </Link.Menu>
                        </Link>
                      </View>

                      {/* 簡介文字 */}
                      <Text style={styles.bioHorizontal} numberOfLines={2}>
                        {companion.bio}
                      </Text>

                      {/* 簡化的操作區 */}
                      <View style={styles.simpleActions}>
                        {onQuickAnalysis && (
                          <TouchableOpacity
                            style={styles.quickAnalysisBtn}
                            onPress={e => {
                              e.stopPropagation();
                              onQuickAnalysis(companion);
                            }}
                          >
                            <Ionicons name="flash" size={14} color="#FFFFFF" />
                            <Text style={styles.quickAnalysisBtnText}>快速分析</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.viewProfileBtn}
                          onPress={e => {
                            e.stopPropagation();
                            onViewProfile(companion);
                          }}
                        >
                          <Text style={styles.viewProfileBtnText}>查看詳情</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* 強化的新增分身按鈕 */}
          <View style={styles.addCompanionCardEnhanced}>
            <TouchableOpacity style={styles.addButtonEnhanced} onPress={() => setIsCreateModalVisible(true)}>
              <View style={styles.addIconContainer}>
                <Ionicons name="add-circle" size={48} color="#FF6B9D" />
              </View>
              <Text style={styles.addTextEnhanced}>建立新助手</Text>
              <Text style={styles.addSubtextEnhanced}>為心動對象建立專屬的AI分身助手</Text>
              <View style={styles.addCallToAction}>
                <Text style={styles.addCallToActionText}>點擊開始 ▶</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* 底部提示 */}
      <View style={styles.bottomTip}>
        <Text style={styles.tipText}>💝 AI分析她的個性，提供最佳聊天建議</Text>
      </View>

      {/* 創建助手彈窗 */}
      <CreateCompanionModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSave={(companion) => {
          setIsCreateModalVisible(false);
          onCreateCompanion(companion);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backgroundGradient: {
    paddingBottom: 10,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 15,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  companionListContainer: {
    flex: 1,
  },
  companionList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  companionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 1,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255, 107, 157, 0.06)",
  },
  cardTouchable: {
    flex: 1,
  },
  cardContentHorizontal: {
    flexDirection: "row",
    padding: 18,
    alignItems: "flex-start",
  },
  leftSection: {
    marginRight: 16,
  },
  avatarWrapperHorizontal: {
    position: "relative",
  },
  rightSection: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: 80,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  nameAgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nameHorizontal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginRight: 8,
  },
  ageTagHorizontal: {
    backgroundColor: "rgba(255, 107, 157, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ageTagHorizontalText: {
    fontSize: 11,
    color: "#FF6B9D",
    fontWeight: "600",
  },
  moreButtonHorizontal: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(156, 163, 175, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.15)",
  },
  bioHorizontal: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    fontWeight: "400",
    marginBottom: 12,
    flex: 1,
  },
  simpleActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  quickAnalysisBtn: {
    backgroundColor: "#9333EA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  quickAnalysisBtnText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  viewProfileBtn: {
    backgroundColor: "#FF6B9D",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewProfileBtnText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  addCompanionCard: {
    backgroundColor: "rgba(255, 107, 157, 0.05)",
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 107, 157, 0.2)",
    borderStyle: "dashed",
  },
  addButton: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  addIcon: {
    fontSize: 48,
    color: "#FF6B9D",
    fontWeight: "300",
    marginBottom: 8,
  },
  addText: {
    fontSize: 18,
    color: "#FF6B9D",
    fontWeight: "600",
    marginBottom: 4,
  },
  addSubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomTip: {
    padding: 16,
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  tipText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },

  // 頂部新增按鈕樣式
  createButtonTop: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  createButtonTopText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // 強化的新增卡片樣式
  addCompanionCardEnhanced: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: "#FF6B9D",
    overflow: "hidden",
  },
  addButtonEnhanced: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 157, 0.05)",
  },
  addIconContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "rgba(255, 107, 157, 0.1)",
    borderRadius: 40,
  },
  addTextEnhanced: {
    fontSize: 22,
    color: "#FF6B9D",
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  addSubtextEnhanced: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  addCallToAction: {
    backgroundColor: "#FF6B9D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addCallToActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
