# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` or `npx expo start` - Start Expo development server
- `npm run android` - Start on Android emulator/device  
- `npm run ios` - Start on iOS simulator/device
- `npm run web` - Start web version
- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Reset to blank app (moves current code to app-example/)

## Project Architecture

This is an Expo React Native app using:

- **Expo Router** for file-based routing (expo-router v6)
- **TypeScript** with strict mode enabled
- **React Navigation** for tab-based navigation 
- **Reanimated v4** for animations with React Compiler experimental support
- **Expo SDK 54** with new architecture enabled

### Key Directory Structure

- `app/` - File-based routing with Expo Router
  - `app/(tabs)/` - Tab navigation screens (index.tsx, explore.tsx)
  - `app/_layout.tsx` - Root layout with theme provider
  - `app/modal.tsx` - Modal screen
- `components/` - Reusable React components including UI components in `components/ui/`
- `hooks/` - Custom React hooks (color scheme, theme management)
- `constants/` - App constants like theme definitions
- `assets/` - Static assets (images, icons, etc.)

### Theme System

The app uses a comprehensive theme system with:
- Automatic light/dark mode detection via `useColorScheme` hook
- React Navigation theme provider integration
- Theme-aware components in `components/themed-*`

### Configuration Notes

- Path aliases configured with `@/*` pointing to project root
- ESLint with Expo config for code quality
- VS Code settings for auto-formatting and import organization
- TypeScript strict mode enabled for type safety
## 專案管理指引

### 文檔管理
- **產品需求文件**: `docs/prd.md` - 完整的產品規劃和需求定義
- **開發任務清單**: `docs/todo.md` - 詳細的功能開發TODO清單

### 任務完成追蹤規則
每完成一個 `docs/todo.md` 中的功能項目後：
1. 在該項目前加上 `~~刪除線~~` 標記
2. 更新文件底部的完成狀態統計
3. 提交代碼變更時在commit message中註明完成的功能

### 開發規範
1. **語言**: 一律使用繁體中文進行回應和文檔撰寫
2. **代碼結構**: 所有新建程式碼放在 `src/` 目錄下
3. **檔案註解**: 每個新建文件頂部必須包含詳細註解說明
4. **階段性開發**: 採用MVP方式，優先完成核心功能驗證市場需求

### 技術選型限制
- **AI服務**: 使用 OpenAI API，不使用 Azure.Microsoft.com 服務
- **成本控制**: 嚴格監控API使用成本，確保盈利能力
- **收費策略**: MVP版本即開始收費，避免API成本虧損