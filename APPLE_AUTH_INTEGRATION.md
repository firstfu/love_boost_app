# Apple 登入前後端串接實作文檔

## 概述
本文檔記錄了 Love Boost App 中 Apple 登入功能的前後端串接實作。

## 實作完成的功能

### 後端 API (love_boost_api)

#### 1. 專案結構
```
love_boost_api/
├── src/
│   ├── config/settings.py          # 應用配置
│   ├── models/user.py              # 用戶資料模型
│   ├── services/
│   │   ├── apple_auth.py           # Apple 認證服務
│   │   ├── jwt_service.py          # JWT Token 服務
│   │   └── user_service.py         # 用戶業務邏輯
│   ├── routers/auth.py             # 認證 API 路由
│   ├── middleware/auth.py          # 認證中間件
│   └── utils/database.py           # 資料庫工具
├── main.py                         # FastAPI 主應用
├── .env                           # 環境變數配置
└── pyproject.toml                 # Python 依賴管理
```

#### 2. 主要 API 端點
- `POST /api/v1/auth/apple` - Apple 登入驗證
- `POST /api/v1/auth/refresh` - 刷新認證 token
- `GET /api/v1/auth/me` - 獲取當前用戶資訊
- `POST /api/v1/auth/logout` - 用戶登出
- `GET /health` - 健康檢查

#### 3. 核心功能
- Apple Identity Token 驗證（向 Apple 服務器驗證 token 有效性）
- 用戶自動註冊/登入
- JWT Token 生成和管理
- SQLite 資料庫用戶資料儲存
- CORS 配置支援前端應用

### 前端 App (love_boost_app)

#### 1. 服務層架構
```
src/services/
├── apiClient.ts          # HTTP API 客戶端
├── tokenService.ts       # Token 安全儲存管理
├── authService.ts        # 認證業務邏輯
└── testApiConnection.ts  # API 連接測試工具
```

#### 2. 主要功能
- 與 expo-apple-authentication 整合
- 安全 Token 儲存（使用 expo-secure-store）
- 自動 Token 刷新機制
- 用戶狀態管理（Zustand store 整合）
- API 錯誤處理和重試邏輯

#### 3. 認證流程
1. 用戶點擊 Apple 登入按鈕
2. 調用 Apple 原生認證
3. 獲取 Identity Token 和用戶資訊
4. 發送到後端 API 驗證
5. 儲存後端返回的 JWT Token
6. 更新用戶狀態到 Zustand store

## 環境配置

### 後端環境變數 (.env)
```bash
# JWT 設定
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# Apple 認證設定（需要實際值）
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_CLIENT_ID=com.loveboost.firstfu

# 資料庫設定
DATABASE_URL=sqlite:///./love_boost.db

# CORS 設定
CORS_ORIGINS=["http://localhost:3000","http://localhost:8081","exp://192.168.1.100:8081"]
```

### 前端配置
- API Base URL：開發環境自動配置 `http://localhost:8001`
- Token 儲存：使用 expo-secure-store 進行安全儲存
- 自動認證檢查：應用啟動時自動初始化

## 技術棧

### 後端
- **FastAPI** - Web 框架
- **SQLAlchemy** - ORM
- **PyJWT** - JWT Token 處理
- **python-jose** - Apple Token 驗證
- **httpx** - HTTP 客戶端
- **SQLite** - 資料庫

### 前端
- **Expo** - React Native 開發框架
- **expo-apple-authentication** - Apple 登入
- **expo-secure-store** - 安全儲存
- **Zustand** - 狀態管理
- **TypeScript** - 型別檢查

## 部署注意事項

### Apple 開發者配置
1. 需要配置 Apple Developer 帳號
2. 設定 App ID 和 Bundle Identifier
3. 啟用 Sign In with Apple 功能
4. 獲取必要的 Team ID 和 Key ID

### 安全考量
- JWT Secret Key 必須在生產環境中使用強密碼
- Apple Identity Token 僅用於後端驗證，不在前端持久化
- 使用 HTTPS 進行生產環境通信
- Token 有效期設定和自動刷新機制

## 測試
- 後端 API 健康檢查：`curl http://localhost:8001/health`
- 前端會在應用啟動時自動測試 API 連接
- 日誌輸出完整的認證流程狀態

## 未來改進
1. 新增更多 OAuth 提供商（Google, Facebook）
2. 實作 refresh token 黑名單機制
3. 新增用戶資料同步功能
4. 實作更詳細的錯誤處理和用戶反饋
5. 新增 API 使用統計和監控

## 故障排除
- 確保後端 API 在 8001 端口運行
- 檢查環境變數是否正確配置
- 確認 Apple 認證設定是否正確
- 查看控制台日誌獲取詳細錯誤信息