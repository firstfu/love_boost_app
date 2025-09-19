# 戀愛助手 AI (Love Boost AI) 📱

一款基於 AI 技術的個人化戀愛模擬助手應用，用戶可以為特定對象建立專屬的 AI 助手，透過多模態資料分析提供模擬對話、語音通話、以及實時戀愛建議的完全自動化服務。

## 🆕 最近更新 (2025-09-20)
- ✅ 移除免費會員顯示功能，優化用戶界面體驗
- ✅ 完成主要導航結構和用戶界面設計
- ✅ 實現 AI 助手管理系統的基礎功能
- ✅ 完成對話練習和歷史記錄功能

## ✨ 產品特色

- 🤖 **個人化 AI 助手**：針對特定對象建立專屬 AI 模擬助手
- 💬 **智能對話模擬**：基於真實資料學習個性與回應模式
- 🎯 **實時建議系統**：提供話術優化、話題推薦、回應時機建議
- 🗣️ **語音通話模擬**：文字轉語音與語音識別整合
- 📸 **多模態分析**：支援照片、對話記錄、語音資料整合分析
- 🔒 **隱私保護**：端到端加密，資料完全隔離存儲

## 🏗️ 技術架構

### 前端技術棧
- **React Native 0.81.4** - 跨平台移動應用框架
- **Expo SDK 54** - 開發工具鏈與部署平台
- **React 19.1.0** - 最新 React 版本支援
- **TypeScript** - 型別安全開發
- **Expo Router v6** - 檔案式路由系統
- **React Navigation 7** - 導航管理
- **Reanimated v4** - 高效能動畫引擎
- **Zustand** - 輕量化狀態管理

### AI 技術棧
- **OpenAI GPT-4o** - 深度個性分析與複雜對話
- **OpenAI GPT-4o-mini** - 日常對話與建議生成
- **OpenAI Whisper** - 語音識別
- **OpenAI TTS** - 文字轉語音
- **OpenAI Vision API** - 圖片內容分析

## 🚀 快速開始

### 環境需求
- Node.js 18+
- npm 或 yarn
- Expo CLI
- iOS Simulator (macOS) 或 Android Studio

### 安裝步驟

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm start
   # 或使用
   npx expo start
   ```

3. **選擇平台運行**
   - 按 `i` 開啟 iOS 模擬器
   - 按 `a` 開啟 Android 模擬器
   - 按 `w` 開啟 Web 版本
   - 掃描 QR Code 在實體設備運行

## 📱 應用截圖

<div align="center">
<img src="./docs/imgs/img1.png" width="300" alt="應用主界面">
<img src="./docs/imgs/img2.png" width="300" alt="AI助手管理">
<img src="./docs/imgs/img3.png" width="300" alt="對話練習功能">
</div>

## 📱 開發指令

```bash
# 開發伺服器
npm start                    # 啟動 Expo 開發伺服器
npm run android             # 在 Android 設備/模擬器運行
npm run ios                 # 在 iOS 設備/模擬器運行
npm run web                 # 在瀏覽器運行

# 程式碼品質
npm run lint                # ESLint 程式碼檢查

# 專案管理
npm run reset-project       # 重置為空白專案
```

## 📁 專案結構

```
love_boost_app/
├── app/                    # Expo Router 檔案式路由
│   ├── (tabs)/            # 分頁導航畫面
│   ├── _layout.tsx        # 根布局組件
│   └── modal.tsx          # 模態畫面
├── src/                   # 主要應用邏輯
│   ├── components/        # React 組件
│   │   └── screens/       # 畫面組件
│   ├── stores/            # Zustand 狀態管理
│   ├── types/             # TypeScript 型別定義
│   └── data/              # 資料檔案
├── components/            # 可重複使用組件
│   ├── ui/               # UI 基礎組件
│   └── themed-*          # 主題感知組件
├── hooks/                 # 自定義 React Hooks
├── constants/             # 應用常數
├── assets/               # 靜態資源
└── docs/                 # 專案文檔
    ├── prd.md            # 產品需求文件
    └── todo.md           # 開發任務清單
```

## 🎯 核心功能模組

### 1. 用戶管理系統 ✅
- ✅ 個人資料管理（ProfileScreen）
- ✅ 隱私設定控制（隱私權政策、使用條款）
- ✅ 帳戶管理功能（登出、刪除帳戶）
- 🔄 Apple Sign-In 身份驗證（開發中）

### 2. AI 助手管理 ✅
- ✅ 多助手建立與管理（CreateCompanion、EditCompanion）
- ✅ 資料上傳與整合（AddCompanionData）
- ✅ 助手檔案管理（CompanionProfile）
- 🔄 個性檔案自動生成（API 整合中）

### 3. 智能對話模擬 ✅
- ✅ 文字對話練習（ConversationPractice）
- ✅ 對話歷史記錄（ConversationHistory）
- ✅ 操作建議界面（CompanionActions）
- 🔄 語音通話模擬（規劃中）
- 🔄 即時建議提供（API 整合中）

### 4. 分析與建議引擎 🔄
- ✅ 快速分析功能（QuickAnalysis）
- 🔄 個性特徵分析（API 開發中）
- 🔄 溝通模式識別（規劃中）
- 🔄 對話效果評估（規劃中）

## 🔧 開發規範

### 程式碼風格
- 使用 TypeScript 嚴格模式
- 遵循 ESLint Expo 配置
- 採用檔案式路由架構
- 組件放置於 `src/components/` 目錄

### 狀態管理
```typescript
// 使用 Zustand 進行狀態管理
// 範例：src/stores/assistantStore.ts
import { create } from 'zustand';

interface AssistantStore {
  assistants: Assistant[];
  currentAssistant: Assistant | null;
  setCurrentAssistant: (assistant: Assistant) => void;
}
```

### 路由結構
```typescript
// 使用 Expo Router 檔案式路由
// app/(tabs)/index.tsx - 主頁
// app/(tabs)/explore.tsx - 探索頁
// app/modal.tsx - 模態頁面
```

## 🔒 安全與隱私

- **資料加密**：所有用戶資料採用端到端加密存儲
- **隱私保護**：用戶可隨時刪除任何助手資料
- **資料隔離**：每個助手資料完全獨立存儲
- **透明政策**：明確的資料使用與隱私政策

## 📈 開發階段

### MVP 階段（當前 - 60% 完成）
- ✅ 基礎架構搭建（Expo Router、TypeScript、Zustand）
- ✅ 用戶界面系統（導航、主題、響應式設計）
- ✅ AI 助手管理功能（建立、編輯、資料上傳）
- ✅ 對話模擬核心功能（練習模式、歷史記錄）
- ✅ 個人資料管理（設定頁面、隱私選項）
- 🔄 後端 API 整合
- 🔄 OpenAI API 集成
- 🔄 用戶認證系統完善

### 增強版（規劃中）
- 語音通話模擬（Whisper + TTS）
- 實際對話分析與建議
- 進階個性分析引擎
- 用戶體驗優化與 A/B 測試

## 🤝 開發團隊

本專案採用 MVP 敏捷開發模式，重視：
- 快速迭代與用戶回饋
- 程式碼品質與型別安全
- 用戶隱私與資料安全
- 成本效益與獲利能力

## 📚 相關文檔

- [產品需求文件 (PRD)](./docs/prd.md) - 完整產品規劃與功能規格
- [開發任務清單](./docs/todo.md) - 詳細功能開發進度
- [技術架構文檔](./docs/technical-architecture.md) - 系統架構設計
- [成本分析](./docs/cost-analysis.md) - API 使用成本與收益分析
- [更新日誌](./docs/changelog.md) - 專案重要更新歷史
- [Expo 官方文檔](https://docs.expo.dev/) - Expo 框架指南
- [React Native 文檔](https://reactnative.dev/) - React Native 開發指南

## 📝 授權條款

此專案為私有專案，僅供授權開發團隊使用。

---

**戀愛助手 AI** - 讓 AI 成為你的戀愛導師 💕
