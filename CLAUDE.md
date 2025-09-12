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
- 1、請將規畫書寫成 prd.md 放在 docs 目錄下。                                                                
2、請將規畫書拆解成不同的子功能 todo, 然後放在 docs 目錄下的 todo.md 文件。        3、更新CLAUDE.md 文件，請寫上每完成一個 todo的功能，要將 todo.md 裡面對應的功能劃掉。   
4、一律用繁體中文回應。  
5、每個文件的頂部要加上詳細的註解。
6、在根目錄下新建資料夾src，新建的程式之後都放在這個資料夾。 
7、要分階段性的完成這個系統，第一版要以 mvp 最小可行性商品推出市場，驗證整個假品最主要的假設與需求。之後視市場反應再完成其他次要的功能。
8、文件要預估成本、收費。api的成本上網查。要給我預估的每人用戶成本，怎麼收費，收費多少。要詳細的說明並給結論。不要讓我虧錢。
9、mvp版本我就要收費了，不然 api 太貴了。
10、不要用 azure.microsoft.com的，llm 直接用 openapi