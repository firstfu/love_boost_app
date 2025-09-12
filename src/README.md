# 戀愛助手AI系統 - src 目錄架構說明

<!--
作者: AI助理
建立時間: 2025-09-12
文件目的: 說明src目錄下各資料夾的用途和職責劃分
版本: v1.0
維護者: 開發團隊
-->

## 目錄結構說明

### `/src/components/`
**用途**: 存放可重用的React Native元件
- `common/` - 通用元件（按鈕、輸入框、載入動畫等）
- `forms/` - 表單相關元件
- `media/` - 媒體處理元件（圖片上傳、預覽等）
- `ai/` - AI分析結果展示元件

### `/src/screens/`
**用途**: 存放各頁面/畫面元件
- `auth/` - 註冊登入相關頁面
- `profile/` - 用戶個人資料頁面
- `targets/` - 目標對象管理頁面
- `analysis/` - AI分析結果頁面
- `chat/` - 對話建議頁面
- `settings/` - 設定頁面

### `/src/services/`
**用途**: 存放業務邏輯和外部API呼叫
- `api/` - API請求相關服務
- `ai/` - AI分析服務整合
- `auth/` - 身份驗證服務
- `storage/` - 本地存儲服務
- `upload/` - 檔案上傳服務

### `/src/utils/`
**用途**: 存放工具函式和幫助程式
- `validation/` - 資料驗證工具
- `formatters/` - 資料格式化工具
- `constants/` - 常數定義
- `helpers/` - 通用幫助函式

### `/src/types/`
**用途**: 存放TypeScript型別定義
- `api.ts` - API回應型別
- `user.ts` - 用戶相關型別
- `ai.ts` - AI分析相關型別
- `navigation.ts` - 導航型別定義

### `/src/hooks/`
**用途**: 存放自訂React Hooks
- `useAuth.ts` - 身份驗證Hook
- `useAI.ts` - AI分析Hook
- `useStorage.ts` - 存儲管理Hook
- `useUpload.ts` - 檔案上傳Hook

### `/src/navigation/`
**用途**: 存放導航配置和路由定義
- `AppNavigator.tsx` - 主導航器
- `AuthNavigator.tsx` - 登入相關導航
- `TabNavigator.tsx` - 底部分頁導航

### `/src/store/`
**用途**: 存放狀態管理相關檔案
- `slices/` - Redux Toolkit slices
- `index.ts` - Store配置
- `middleware.ts` - 中間件配置

### `/src/config/`
**用途**: 存放配置檔案
- `env.ts` - 環境變數管理
- `api.ts` - API配置
- `storage.ts` - 存儲配置
- `ai.ts` - AI服務配置

## 開發規範

### 檔案命名規則
- 元件檔案使用 PascalCase：`UserProfile.tsx`
- 服務檔案使用 camelCase：`authService.ts`
- 型別檔案使用 camelCase：`userTypes.ts`
- Hook檔案以 `use` 開頭：`useAuth.ts`

### 匯入順序
1. React 相關匯入
2. 第三方套件匯入
3. 本地元件匯入
4. 型別匯入
5. 樣式匯入

### 程式碼組織原則
- 單一責任原則：每個檔案只負責一個功能
- 可重用性：盡量建立可重用的元件和工具
- 型別安全：所有檔案都要有適當的TypeScript型別
- 錯誤處理：適當的錯誤處理和異常管理

## 下一步行動

根據 `docs/todo.md` 的開發計劃，接下來應該：
1. 開始建立基礎的API服務架構
2. 設計用戶管理系統
3. 開發前端核心元件

詳細的開發任務請參考 `docs/todo.md` 檔案。