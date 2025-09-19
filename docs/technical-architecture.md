# AI 戀愛模擬助手系統技術架構文件

<!--
作者: AI助理
建立時間: 2025-09-13
文件目的: 定義 AI 戀愛模擬助手系統的完整技術架構和實現細節
版本: v1.0
適用階段: MVP 至完整版開發
-->

## 1. 系統概述

### 1.1 架構原則

本系統採用**微服務架構**設計，確保高可擴展性、高可用性和模組化開發。核心設計原則包括：

- **資料隔離**：每個 AI 助手的資料完全隔離
- **多模態整合**：統一處理文字、圖片、語音資料
- **成本優化**：分層 AI 模型使用策略
- **隱私優先**：端到端加密與資料保護
- **即時回應**：優化用戶體驗的低延遲設計

### 1.2 技術棧總覽 (當前實現狀態)

**前端：** ✅

- React Native 0.81.4 + Expo SDK 54
- TypeScript (嚴格模式)
- Expo Router v6 (檔案式路由)
- React Navigation 7 (Tab 導航)
- Zustand (狀態管理) - assistantStore, userStore
- React 19.1.0 支援
- Reanimated v4 (動畫引擎)
- Expo Linear Gradient、Image Picker、Document Picker

**後端：** 🔄

- FastAPI (Python) - 規劃中
- PostgreSQL + pgvector (內建向量功能) - 規劃中
- DigitalOcean 基礎設施 - 規劃中

**AI 服務：** 🔄

- OpenAI GPT-4o-mini (多模態統一模型) - API 整合中
- OpenAI Whisper + TTS (語音功能) - 規劃中

## 2. 整體系統架構

### 2.1 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                       用戶端 (React Native)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐   │
│  │   助手管理   │ │   對話模擬   │ │   語音通話   │ │  分析報告 │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (FastAPI)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐   │
│  │  身份認證     │ │  助手管理     │ │  對話引擎     │ │ 分析引擎  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        AI 服務層                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   GPT-4o-mini       │ │   Whisper   │ │     TTS     │       │
│  │    (多模態統一)      │ │ (語音識別)   │ │ (語音合成)   │       │
│  └─────────────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────────┐
                              │
┌─────────────────────────────────────────────────────────────┐
│                        資料儲存層                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐ ┌─────────────────────┐   │
│  │        PostgreSQL               │ │    本地檔案儲存      │   │
│  │     (包含 pgvector)             │ │                     │   │
│  └─────────────────────────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 資料流架構

#### 2.2.1 助手建立流程

```
用戶建立助手 → 上傳資料 → AI 分析處理 → 個性檔案生成 → 模擬對話啟用
```

#### 2.2.2 對話模擬流程

```
用戶輸入 → 個性檔案匹配 → GPT-4o-mini 回應生成 → 建議生成 → 回傳結果
```

#### 2.2.3 語音通話流程

```
語音輸入 → Whisper 轉文字 → GPT-4o-mini 處理 → TTS 轉語音 → 語音輸出
```

#### 2.2.4 圖片分析流程

```
圖片上傳 → GPT-4o-mini 多模態分析 → 個性特徵提取 → 存儲到 pgvector
```

## 3. 已實現前端功能模組

### 3.1 用戶界面架構 ✅

#### 3.1.1 路由系統
- **Expo Router v6**: 檔案式路由架構
- **主要路由**:
  - `app/(tabs)/index.tsx` - 主頁 (MainApp)
  - `app/(tabs)/profile.tsx` - 個人資料頁
  - `app/guide.tsx` - 使用指南
  - `app/upgrade.tsx` - 升級方案
  - `app/support.tsx` - 聯絡支援

#### 3.1.2 主要螢幕組件
- **MainApp** - 助手管理主頁面
- **ProfileScreen** - 個人資料與設定
- **CreateCompanion** - 建立新助手
- **EditCompanion** - 編輯助手資料
- **ConversationPractice** - 對話練習
- **ConversationHistory** - 對話歷史記錄
- **QuickAnalysis** - 快速分析功能

### 3.2 狀態管理 ✅

#### 3.2.1 Zustand 狀態管理
```typescript
// assistantStore.ts - AI 助手狀態管理
interface AssistantStore {
  assistants: Assistant[];
  currentAssistant: Assistant | null;
  conversations: Conversation[];
  // 助手管理、對話管理等功能
}

// userStore.ts - 用戶狀態管理
interface UserStore {
  user: User | null;
  membershipPlan: MembershipPlan;
  // 用戶認證、會員狀態等
}
```

### 3.3 UI 組件系統 ✅

#### 3.3.1 主題系統
- **自動深色/淺色模式** (`useColorScheme`)
- **React Navigation 主題整合**
- **Linear Gradient 背景**
- **Themed 組件** (`themed-text`, `themed-view`)

#### 3.3.2 媒體處理
- **Expo Image Picker** - 照片選擇與上傳
- **Expo Document Picker** - 文件選擇
- **圖片預覽與管理**

## 4. 核心服務模組設計 (後端規劃)

### 4.1 身份認證服務 (Auth Service)

#### 4.1.1 功能職責

- Apple Sign-In 整合
- JWT Token 管理
- 用戶權限控制
- 訂閱狀態驗證

#### 4.1.2 資料庫設計

```sql
-- 用戶表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apple_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(100),
    subscription_tier ENUM('basic', 'premium', 'professional') DEFAULT 'basic',
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 用戶設定表
CREATE TABLE user_settings (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    gender ENUM('male', 'female', 'other'),
    usage_purpose TEXT,
    privacy_settings JSONB,
    notification_settings JSONB,
    PRIMARY KEY (user_id)
);
```

#### 4.1.3 API 端點設計

```python
@router.post("/auth/apple-signin")
async def apple_signin(token: str) -> AuthResponse

@router.post("/auth/refresh")
async def refresh_token(refresh_token: str) -> TokenResponse

@router.delete("/auth/logout")
async def logout(current_user: User) -> SuccessResponse
```

### 4.2 AI 助手管理服務 (Assistant Service)

#### 4.2.1 功能職責

- 助手 CRUD 操作
- 助手資料管理
- 權限與限制控制
- 資料隔離機制

#### 4.2.2 資料庫設計

```sql
-- 助手表
CREATE TABLE assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    target_age INTEGER,
    target_gender ENUM('male', 'female', 'other'),
    relationship_status VARCHAR(50),
    personality_profile JSONB,
    analysis_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 助手照片表
CREATE TABLE assistant_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_id UUID REFERENCES assistants(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    photo_type ENUM('avatar', 'lifestyle') NOT NULL,
    analysis_result JSONB,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 助手對話記錄表
CREATE TABLE assistant_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_id UUID REFERENCES assistants(id) ON DELETE CASCADE,
    conversation_text TEXT NOT NULL,
    conversation_type ENUM('text_import', 'screenshot_ocr') NOT NULL,
    metadata JSONB,
    imported_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.2.3 API 端點設計

```python
@router.post("/assistants")
async def create_assistant(data: AssistantCreateRequest, current_user: User) -> AssistantResponse

@router.get("/assistants")
async def list_assistants(current_user: User) -> List[AssistantResponse]

@router.get("/assistants/{assistant_id}")
async def get_assistant(assistant_id: UUID, current_user: User) -> AssistantResponse

@router.put("/assistants/{assistant_id}")
async def update_assistant(assistant_id: UUID, data: AssistantUpdateRequest, current_user: User) -> AssistantResponse

@router.delete("/assistants/{assistant_id}")
async def delete_assistant(assistant_id: UUID, current_user: User) -> SuccessResponse

@router.post("/assistants/{assistant_id}/photos")
async def upload_photos(assistant_id: UUID, files: List[UploadFile], current_user: User) -> PhotoUploadResponse

@router.post("/assistants/{assistant_id}/conversations")
async def import_conversations(assistant_id: UUID, data: ConversationImportRequest, current_user: User) -> ImportResponse
```

### 3.3 AI 分析引擎 (Analysis Engine)

#### 3.3.1 功能職責

- 多模態資料分析 (GPT-4o-mini 統一處理)
- 個性檔案生成
- 向量嵌入管理 (pgvector)
- 成本優化與統一介面

#### 3.3.2 統一分析管道設計

```python
class AnalysisPipeline:
    def __init__(self):
        self.ai_client = UnifiedAIClient()  # GPT-4o-mini 統一介面
        self.vector_store = PgVectorStore()

    async def analyze_assistant(self, assistant_id: UUID) -> PersonalityProfile:
        # 1. 多模態分析 (GPT-4o-mini 處理圖片+文字)
        multimodal_analysis = await self.ai_client.analyze_multimodal(assistant_id)

        # 2. 生成向量嵌入並存儲
        embeddings = await self.ai_client.generate_embeddings(multimodal_analysis)
        await self.vector_store.store_vectors(assistant_id, embeddings)

        # 3. 個性檔案生成
        personality = await self.ai_client.generate_personality_profile(
            multimodal_analysis
        )

        return personality
```

#### 3.3.3 統一 AI 介面設計

```python
class UnifiedAIClient:
    def __init__(self):
        self.client = OpenAIClient(model="gpt-4o-mini")

    async def analyze_multimodal(self, assistant_id: UUID) -> dict:
        """使用 GPT-4o-mini 統一處理圖片和文字分析"""

        # 獲取助手的所有資料
        photos = await self.get_assistant_photos(assistant_id)
        conversations = await self.get_assistant_conversations(assistant_id)

        # 構建多模態 prompt
        messages = []
        messages.append({
            "role": "system",
            "content": "你是一個個性分析專家，請分析以下圖片和對話內容，生成詳細的個性檔案。"
        })

        # 添加圖片
        for photo in photos:
            messages.append({
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": photo.url}},
                    {"type": "text", "text": "請分析這張照片的個性特徵"}
                ]
            })

        # 添加對話內容
        messages.append({
            "role": "user",
            "content": f"對話內容分析：\n{conversations}"
        })

        # 調用 GPT-4o-mini
        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={"type": "json_object"}
        )

        return json.loads(response.choices[0].message.content)

    async def perform_ocr(self, image_data: bytes) -> str:
        """使用 GPT-4o-mini 進行 OCR 文字識別"""

        messages = [{
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64.b64encode(image_data).decode()}"}
                },
                {
                    "type": "text",
                    "text": "請將圖片中的所有文字內容轉換為純文字格式，保持原有的格式和段落。"
                }
            ]
        }]

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )

        return response.choices[0].message.content
```

### 3.4 對話模擬引擎 (Conversation Engine)

#### 3.4.1 功能職責

- 基於個性的對話生成
- 實時建議生成
- 對話歷史管理
- 上下文記憶維護

#### 3.4.2 對話引擎設計

```python
class ConversationEngine:
    def __init__(self):
        self.ai_client = UnifiedAIClient()  # 統一使用 GPT-4o-mini
        self.vector_store = PgVectorStore()
        self.db_cache = DatabaseCache()  # 使用 PostgreSQL 快取

    async def generate_response(
        self,
        assistant_id: UUID,
        user_message: str,
        conversation_history: List[Message],
        scenario: str = "casual"
    ) -> ConversationResponse:

        # 從快取或資料庫載入個性檔案
        personality = await self.db_cache.get_personality(assistant_id)
        if not personality:
            personality = await self.load_personality_from_db(assistant_id)
            await self.db_cache.set_personality(assistant_id, personality)

        # 使用向量搜索找出相似對話
        similar_conversations = await self.vector_store.similarity_search(
            assistant_id, user_message, limit=3
        )

        # 建構統一 prompt
        conversation_prompt = self._build_unified_prompt(
            personality, user_message, conversation_history, similar_conversations, scenario
        )

        # 使用 GPT-4o-mini 生成回應和建議
        response = await self.ai_client.generate_conversation_response(conversation_prompt)

        return ConversationResponse(
            ai_response=response.get("response"),
            suggestions=response.get("suggestions", []),
            scenario=scenario,
            confidence_score=response.get("confidence", 0.8)
        )

    def _build_unified_prompt(
        self,
        personality: dict,
        user_message: str,
        history: List[Message],
        similar_conversations: List[dict],
        scenario: str
    ) -> str:
        """建構統一的對話生成 prompt"""

        prompt = f"""
        你是一個 AI 戀愛助手，正在模擬以下個性的人：

        個性檔案：
        {json.dumps(personality, ensure_ascii=False, indent=2)}

        相似對話參考：
        {json.dumps(similar_conversations, ensure_ascii=False, indent=2)}

        對話歷史：
        {self._format_conversation_history(history)}

        當前場景：{scenario}
        用戶訊息：{user_message}

        請生成一個 JSON 回應，包含：
        1. response: 模擬該人的回應
        2. suggestions: 3-5 個對用戶的建議
        3. confidence: 回應的信心度 (0-1)
        """

        return prompt
```

#### 3.4.3 資料庫設計

```sql
-- 對話會話表
CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_id UUID REFERENCES assistants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scenario VARCHAR(50) NOT NULL,
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    total_messages INTEGER DEFAULT 0
);

-- 對話訊息表
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    sender_type ENUM('user', 'assistant') NOT NULL,
    message_text TEXT NOT NULL,
    suggestions JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.5 語音處理服務 (Voice Service)

#### 3.5.1 功能職責

- 語音識別 (Whisper)
- 文字轉語音 (TTS)
- 語音快取管理
- 語音對話整合

#### 3.5.2 簡化語音處理管道

```python
class VoiceProcessor:
    def __init__(self):
        self.whisper_client = WhisperClient()
        self.tts_client = TTSClient()
        self.conversation_engine = ConversationEngine()
        self.voice_cache = VoiceCache()  # PostgreSQL 快取

    async def process_voice_input(
        self,
        audio_data: bytes,
        assistant_id: UUID
    ) -> VoiceResponse:

        # 1. 語音轉文字 (Whisper)
        text = await self.whisper_client.transcribe(audio_data)

        # 2. 對話處理 (GPT-4o-mini)
        conversation_response = await self.conversation_engine.generate_response(
            assistant_id, text, conversation_history=[]
        )

        # 3. 檢查語音快取
        cached_audio = await self.voice_cache.get_cached_audio(
            conversation_response.ai_response
        )

        if cached_audio:
            audio_response = cached_audio
        else:
            # 4. 文字轉語音 (TTS)
            audio_response = await self.tts_client.synthesize(
                conversation_response.ai_response
            )
            # 快取語音結果
            await self.voice_cache.cache_audio(
                conversation_response.ai_response, audio_response
            )

        return VoiceResponse(
            transcribed_text=text,
            response_text=conversation_response.ai_response,
            response_audio=audio_response,
            suggestions=conversation_response.suggestions
        )

class VoiceCache:
    """基於 PostgreSQL 的語音快取"""

    async def get_cached_audio(self, text: str) -> bytes:
        # 從資料庫檢查快取的語音
        hash_key = hashlib.md5(text.encode()).hexdigest()
        result = await self.db.fetch_one(
            "SELECT audio_data FROM voice_cache WHERE text_hash = $1", hash_key
        )
        return result['audio_data'] if result else None

    async def cache_audio(self, text: str, audio_data: bytes):
        # 快取語音到資料庫
        hash_key = hashlib.md5(text.encode()).hexdigest()
        await self.db.execute(
            """INSERT INTO voice_cache (text_hash, text_content, audio_data, created_at)
               VALUES ($1, $2, $3, NOW())
               ON CONFLICT (text_hash) DO NOTHING""",
            hash_key, text, audio_data
        )
```

#### 3.5.3 API 端點設計

```python
@router.post("/voice/conversation")
async def voice_conversation(
    assistant_id: UUID,
    audio_file: UploadFile,
    current_user: User
) -> VoiceConversationResponse

@router.post("/voice/tts")
async def text_to_speech(
    text: str,
    voice_settings: VoiceSettings,
    current_user: User
) -> AudioResponse
```

### 3.6 檔案管理服務 (File Service)

#### 3.6.1 功能職責

- 圖片上傳與處理
- 檔案格式驗證
- 圖片壓縮與優化
- 本地檔案系統管理
- 檔案存取權限控制

#### 3.6.2 檔案處理管道

```python
class FileProcessor:
    def __init__(self):
        self.local_storage = LocalFileStorage()
        self.image_processor = ImageProcessor()
        self.ai_client = UnifiedAIClient()  # 使用 GPT-4o-mini 處理 OCR

    async def process_image_upload(
        self,
        file: UploadFile,
        assistant_id: UUID,
        file_type: str
    ) -> FileUploadResponse:

        # 1. 檔案驗證
        self._validate_file(file)

        # 2. 圖片處理
        processed_image = await self.image_processor.process(file)

        # 3. 儲存到本地檔案系統
        file_path = await self.local_storage.save_file(processed_image, assistant_id)

        # 4. 如果是截圖，使用 GPT-4o-mini 執行 OCR
        ocr_result = None
        if file_type == "screenshot":
            ocr_result = await self.ai_client.perform_ocr(processed_image.data)

        # 5. 如果是助手照片，進行個性分析
        personality_analysis = None
        if file_type in ["avatar", "lifestyle"]:
            personality_analysis = await self.ai_client.analyze_photo_personality(
                processed_image.data, assistant_id
            )

        return FileUploadResponse(
            file_path=file_path,
            ocr_result=ocr_result,
            personality_analysis=personality_analysis,
            file_metadata=processed_image.metadata
        )

#### 3.6.3 本地檔案儲存實現

**檔案目錄結構：**
```

/var/app/storage/
├── photos/
│ ├── {user_id}/
│ │ ├── {assistant_id}/
│ │ │ ├── avatars/
│ │ │ └── lifestyle/
├── audio/
│ ├── {user_id}/
│ │ ├── {assistant_id}/
│ │ │ ├── conversations/
│ │ │ └── tts_cache/
├── backups/
│ ├── daily/
│ └── weekly/
└── temp/
└── uploads/

````

**本地儲存管理類：**
```python
class LocalFileStorage:
    def __init__(self, base_path: str = "/var/app/storage"):
        self.base_path = base_path
        self.photo_path = f"{base_path}/photos"
        self.audio_path = f"{base_path}/audio"
        self.backup_path = f"{base_path}/backups"
        self.temp_path = f"{base_path}/temp"

    async def save_file(
        self,
        file_data: bytes,
        user_id: str,
        assistant_id: str = None,
        file_type: str = "photo",
        category: str = "avatar"
    ) -> str:
        """儲存檔案到本地檔案系統"""

        # 1. 建立目錄結構
        if file_type == "photo":
            dir_path = f"{self.photo_path}/{user_id}/{assistant_id}/{category}"
        elif file_type == "audio":
            dir_path = f"{self.audio_path}/{user_id}/{assistant_id}/{category}"

        os.makedirs(dir_path, exist_ok=True)

        # 2. 生成檔案名稱
        file_id = str(uuid4())
        file_extension = self._get_file_extension(file_data)
        filename = f"{file_id}.{file_extension}"
        file_path = f"{dir_path}/{filename}"

        # 3. 寫入檔案
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_data)

        # 4. 設定檔案權限
        os.chmod(file_path, 0o644)

        return file_path

    async def get_file_url(self, file_path: str) -> str:
        """生成檔案存取 URL"""
        # 轉換本地路徑為 HTTP URL
        relative_path = file_path.replace(self.base_path, "")
        return f"/api/files{relative_path}"

    async def delete_file(self, file_path: str) -> bool:
        """刪除檔案"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {e}")
            return False

    async def save_backup(self, backup_data: bytes, backup_name: str) -> str:
        """儲存備份檔案"""
        backup_path = f"{self.backup_path}/{backup_name}"
        os.makedirs(os.path.dirname(backup_path), exist_ok=True)

        async with aiofiles.open(backup_path, 'wb') as f:
            await f.write(backup_data)

        return backup_path

    def _get_file_extension(self, file_data: bytes) -> str:
        """根據檔案內容判斷副檔名"""
        # 使用 python-magic 或類似工具判斷檔案類型
        if file_data.startswith(b'\xff\xd8\xff'):
            return 'jpg'
        elif file_data.startswith(b'\x89PNG'):
            return 'png'
        elif file_data.startswith(b'RIFF') and b'WEBP' in file_data[:12]:
            return 'webp'
        else:
            return 'bin'
````

**檔案存取 API 端點：**

```python
@router.get("/files/{file_path:path}")
async def serve_file(
    file_path: str,
    current_user: User,
    request: Request
):
    """提供檔案存取服務"""

    # 1. 驗證檔案權限
    if not await _check_file_permission(file_path, current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")

    # 2. 檢查檔案是否存在
    full_path = f"/var/app/storage/{file_path}"
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found")

    # 3. 設定快取標頭
    headers = {
        "Cache-Control": "public, max-age=86400",  # 24小時快取
        "ETag": await _generate_etag(full_path)
    }

    # 4. 回傳檔案
    return FileResponse(
        path=full_path,
        headers=headers,
        media_type=_get_media_type(full_path)
    )

async def _check_file_permission(file_path: str, user_id: str) -> bool:
    """檢查用戶是否有權限存取檔案"""
    # 檢查檔案路徑是否包含用戶 ID
    return user_id in file_path

async def _generate_etag(file_path: str) -> str:
    """生成檔案 ETag"""
    stat = os.stat(file_path)
    return f'"{stat.st_mtime}-{stat.st_size}"'
```

````

## 4. 資料庫設計詳細規格

### 4.1 主資料庫 (PostgreSQL)

#### 4.1.1 完整 ERD 設計
```sql
-- 用戶相關表格
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apple_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(100),
    subscription_tier ENUM('basic', 'premium', 'professional') DEFAULT 'basic',
    subscription_expires_at TIMESTAMP,
    api_usage_this_month INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 助手相關表格
CREATE TABLE assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    target_age INTEGER,
    target_gender ENUM('male', 'female', 'other'),
    relationship_status VARCHAR(50),
    personality_profile JSONB,
    analysis_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    last_analyzed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- 索引
    INDEX idx_assistants_user_id (user_id),
    INDEX idx_assistants_analysis_status (analysis_status)
);

-- 對話會話表
CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_id UUID REFERENCES assistants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_type ENUM('text', 'voice') NOT NULL,
    scenario VARCHAR(50) DEFAULT 'casual',
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    total_messages INTEGER DEFAULT 0,
    quality_score DECIMAL(3,2),

    INDEX idx_conversation_sessions_assistant_id (assistant_id),
    INDEX idx_conversation_sessions_user_id (user_id),
    INDEX idx_conversation_sessions_started_at (started_at)
);

-- API 使用統計表
CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_type ENUM('gpt4o_mini', 'whisper', 'tts') NOT NULL,
    tokens_used INTEGER,
    cost_usd DECIMAL(10,4),
    request_timestamp TIMESTAMP DEFAULT NOW(),

    INDEX idx_api_usage_user_id_timestamp (user_id, request_timestamp),
    INDEX idx_api_usage_service_type_timestamp (service_type, request_timestamp)
);
````

### 4.2 向量資料庫設計 (PostgreSQL + pgvector)

#### 4.2.1 向量存儲表結構

```sql
-- 安裝 pgvector 擴展
CREATE EXTENSION IF NOT EXISTS vector;

-- 對話語義向量表
CREATE TABLE conversation_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_id UUID REFERENCES assistants(id) ON DELETE CASCADE,
    conversation_id UUID,
    text_chunk TEXT NOT NULL,
    embedding VECTOR(1536),  -- OpenAI embedding dimension
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 個性特徵向量表
CREATE TABLE personality_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_id UUID REFERENCES assistants(id) ON DELETE CASCADE,
    feature_type VARCHAR(100) NOT NULL,  -- mbti, communication_style, interests
    feature_value TEXT NOT NULL,
    embedding VECTOR(1536),
    confidence_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 向量相似性查詢索引
CREATE INDEX ON conversation_vectors USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON personality_vectors USING ivfflat (embedding vector_cosine_ops);
```

#### 4.2.2 向量操作實現

```python
class VectorDatabase:
    def __init__(self, db_connection):
        self.db = db_connection

    async def store_conversation_vector(
        self,
        assistant_id: UUID,
        conversation_id: UUID,
        text_chunk: str,
        embedding: List[float],
        metadata: dict = None
    ):
        """存儲對話向量"""
        await self.db.execute(
            """
            INSERT INTO conversation_vectors
            (assistant_id, conversation_id, text_chunk, embedding, metadata)
            VALUES ($1, $2, $3, $4, $5)
            """,
            assistant_id, conversation_id, text_chunk, embedding, metadata or {}
        )

    async def find_similar_conversations(
        self,
        assistant_id: UUID,
        query_embedding: List[float],
        limit: int = 5
    ) -> List[dict]:
        """查找相似對話"""
        return await self.db.fetch(
            """
            SELECT text_chunk, metadata,
                   embedding <=> $2 as distance
            FROM conversation_vectors
            WHERE assistant_id = $1
            ORDER BY embedding <=> $2
            LIMIT $3
            """,
            assistant_id, query_embedding, limit
        )

    async def store_personality_vector(
        self,
        assistant_id: UUID,
        feature_type: str,
        feature_value: str,
        embedding: List[float],
        confidence_score: float = 0.0
    ):
        """存儲個性特徵向量"""
        await self.db.execute(
            """
            INSERT INTO personality_vectors
            (assistant_id, feature_type, feature_value, embedding, confidence_score)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (assistant_id, feature_type)
            DO UPDATE SET
                feature_value = EXCLUDED.feature_value,
                embedding = EXCLUDED.embedding,
                confidence_score = EXCLUDED.confidence_score
            """,
            assistant_id, feature_type, feature_value, embedding, confidence_score
        )
```

### 4.3 快取策略 (PostgreSQL 內建)

#### 4.3.1 快取表設計

```sql
-- 通用快取表
CREATE TABLE app_cache (
    cache_key VARCHAR(255) PRIMARY KEY,
    cache_value JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 定期清理過期快取
CREATE INDEX idx_cache_expires ON app_cache(expires_at);

-- 語音快取表（專用於TTS音頻）
CREATE TABLE voice_cache (
    text_hash VARCHAR(64) PRIMARY KEY,
    audio_data BYTEA NOT NULL,
    voice_model VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.3.2 快取實現

```python
class PostgreSQLCache:
    def __init__(self, db_connection):
        self.db = db_connection

    async def set(self, key: str, value: dict, ttl_seconds: int = 3600):
        """設置快取"""
        expires_at = datetime.now() + timedelta(seconds=ttl_seconds)
        await self.db.execute(
            """
            INSERT INTO app_cache (cache_key, cache_value, expires_at)
            VALUES ($1, $2, $3)
            ON CONFLICT (cache_key)
            DO UPDATE SET
                cache_value = EXCLUDED.cache_value,
                expires_at = EXCLUDED.expires_at
            """,
            key, json.dumps(value), expires_at
        )

    async def get(self, key: str) -> Optional[dict]:
        """獲取快取"""
        result = await self.db.fetch_one(
            """
            SELECT cache_value FROM app_cache
            WHERE cache_key = $1 AND expires_at > NOW()
            """,
            key
        )
        return json.loads(result['cache_value']) if result else None

    async def delete(self, key: str):
        """刪除快取"""
        await self.db.execute(
            "DELETE FROM app_cache WHERE cache_key = $1", key
        )

    async def cleanup_expired(self):
        """清理過期快取"""
        await self.db.execute(
            "DELETE FROM app_cache WHERE expires_at <= NOW()"
        )

# 快取鍵設計
class CacheKeys:
    PERSONALITY = "personality:{assistant_id}"
    SUGGESTIONS = "suggestions:{assistant_id}:{message_hash}"
    SUBSCRIPTION = "subscription:{user_id}"
    USAGE = "usage:{user_id}:{date}"
    VOICE_TTS = "voice:{text_hash}:{voice_model}"
```

## 5. API 設計規範

### 5.1 RESTful API 設計原則

#### 5.1.1 統一回應格式

```python
class StandardResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    request_id: str
```

#### 5.1.2 錯誤處理

```python
class APIError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

# 常見錯誤碼
ERROR_CODES = {
    "ASSISTANT_NOT_FOUND": "助手不存在",
    "SUBSCRIPTION_EXPIRED": "訂閱已過期",
    "USAGE_LIMIT_EXCEEDED": "使用量超過限制",
    "INVALID_FILE_FORMAT": "檔案格式不支援",
    "AI_SERVICE_ERROR": "AI 服務暫時無法使用"
}
```

### 5.2 WebSocket 設計 (即時功能)

#### 5.2.1 即時對話連接

```python
@websocket_router.websocket("/ws/conversation/{assistant_id}")
async def conversation_websocket(
    websocket: WebSocket,
    assistant_id: UUID,
    current_user: User
):
    await websocket.accept()

    try:
        while True:
            # 接收用戶訊息
            data = await websocket.receive_json()

            # 處理對話
            response = await conversation_engine.generate_response(
                assistant_id, data['message'], data.get('history', [])
            )

            # 發送回應
            await websocket.send_json({
                "type": "response",
                "data": response.dict()
            })

    except WebSocketDisconnect:
        pass
```

## 6. 安全性設計

### 6.1 身份認證與授權

#### 6.1.1 JWT Token 設計

```python
class JWTPayload(BaseModel):
    user_id: UUID
    subscription_tier: str
    exp: datetime
    iat: datetime
    jti: str  # JWT ID for revocation
```

#### 6.1.2 權限控制

```python
class PermissionChecker:
    def __init__(self, user: User):
        self.user = user

    def can_create_assistant(self) -> bool:
        current_count = Assistant.count_by_user(self.user.id)
        limits = {
            "basic": 2,
            "premium": 5,
            "professional": 999
        }
        return current_count < limits.get(self.user.subscription_tier, 0)

    def can_use_voice_feature(self) -> bool:
        return self.user.subscription_tier in ["premium", "professional"]
```

### 6.2 資料加密

#### 6.2.1 敏感資料加密

```python
class DataEncryption:
    def __init__(self, secret_key: str):
        self.fernet = Fernet(secret_key.encode())

    def encrypt_conversation(self, text: str) -> str:
        return self.fernet.encrypt(text.encode()).decode()

    def decrypt_conversation(self, encrypted_text: str) -> str:
        return self.fernet.decrypt(encrypted_text.encode()).decode()
```

### 6.3 API 安全防護

#### 6.3.1 頻率限制

```python
@limiter.limit("100/minute")
@router.post("/conversation/generate")
async def generate_conversation(request: Request, ...):
    pass

@limiter.limit("10/minute")
@router.post("/assistants/{assistant_id}/analyze")
async def analyze_assistant(request: Request, ...):
    pass
```

## 7. 效能優化策略

### 7.1 資料庫優化

#### 7.1.1 索引策略

```sql
-- 常用查詢索引
CREATE INDEX idx_assistants_user_created ON assistants(user_id, created_at DESC);
CREATE INDEX idx_conversations_assistant_started ON conversation_sessions(assistant_id, started_at DESC);
CREATE INDEX idx_api_usage_user_date ON api_usage_logs(user_id, DATE(request_timestamp));

-- 複合索引
CREATE INDEX idx_messages_session_created ON conversation_messages(session_id, created_at);
```

#### 7.1.2 查詢優化

```python
# 使用連接減少 N+1 查詢
def get_user_assistants_with_stats(user_id: UUID):
    return db.query(Assistant).options(
        joinedload(Assistant.photos),
        joinedload(Assistant.conversation_sessions)
    ).filter(Assistant.user_id == user_id).all()
```

### 7.2 快取策略

#### 7.2.1 多層快取設計

```python
class CacheManager:
    def __init__(self, db_connection):
        self.db_cache = PostgreSQLCache(db_connection)
        self.local_cache = TTLCache(maxsize=1000, ttl=300)

    async def get_personality(self, assistant_id: UUID) -> Optional[PersonalityProfile]:
        # 1. 本地快取
        if assistant_id in self.local_cache:
            return self.local_cache[assistant_id]

        # 2. PostgreSQL 快取
        cache_key = CacheKeys.PERSONALITY.format(assistant_id=assistant_id)
        cached = await self.db_cache.get(cache_key)
        if cached:
            profile = PersonalityProfile.parse_obj(cached)
            self.local_cache[assistant_id] = profile
            return profile

        # 3. 資料庫查詢
        profile = await self.load_from_database(assistant_id)
        if profile:
            await self.db_cache.set(
                cache_key,
                profile.dict(),
                ttl_seconds=86400  # 24 hours
            )
            self.local_cache[assistant_id] = profile

        return profile
```

### 7.3 AI API 優化

#### 7.3.1 請求批次處理

```python
class BatchProcessor:
    def __init__(self, batch_size: int = 10):
        self.batch_size = batch_size
        self.pending_requests = []

    async def add_request(self, request: AIRequest) -> str:
        request_id = str(uuid4())
        self.pending_requests.append((request_id, request))

        if len(self.pending_requests) >= self.batch_size:
            await self.process_batch()

        return request_id

    async def process_batch(self):
        if not self.pending_requests:
            return

        batch = self.pending_requests[:self.batch_size]
        self.pending_requests = self.pending_requests[self.batch_size:]

        # 批次處理 AI 請求
        await self.send_batch_to_ai_service(batch)
```

## 8. 監控與日誌

### 8.1 系統監控

#### 8.1.1 關鍵指標監控

```python
# Prometheus 指標定義
request_count = Counter('api_requests_total', 'API 請求總數', ['method', 'endpoint'])
request_duration = Histogram('api_request_duration_seconds', 'API 請求時長')
ai_api_cost = Counter('ai_api_cost_usd', 'AI API 成本', ['service'])
active_users = Gauge('active_users_count', '活躍用戶數')
```

#### 8.1.2 健康檢查

```python
@router.get("/health")
async def health_check():
    checks = {
        "database": await check_database_connection(),
        "ai_services": await check_ai_services(),
        "file_storage": await check_file_storage()
    }

    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503

    return JSONResponse(
        status_code=status_code,
        content={
            "status": "healthy" if all_healthy else "unhealthy",
            "checks": checks,
            "timestamp": datetime.now().isoformat()
        }
    )
```

### 8.2 日誌管理

#### 8.2.1 結構化日誌

```python
import structlog

logger = structlog.get_logger()

async def log_conversation_generation(
    user_id: UUID,
    assistant_id: UUID,
    tokens_used: int,
    response_time: float
):
    logger.info(
        "conversation_generated",
        user_id=str(user_id),
        assistant_id=str(assistant_id),
        tokens_used=tokens_used,
        response_time_ms=response_time * 1000,
        service="conversation_engine"
    )
```

## 9. 部署架構

### 9.1 DigitalOcean 基礎設施

#### 9.1.1 伺服器配置

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    image: love-boost-api:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
```

#### 9.1.2 CI/CD 管道

```yaml
# .github/workflows/deploy.yml
name: Deploy to DigitalOcean
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Docker image
        run: docker build -t love-boost-api:${{ github.sha }} .

      - name: Deploy to DigitalOcean
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Update service
        run: |
          doctl compute droplet-action reboot ${{ secrets.DROPLET_ID }}
```

## 10. 災難恢復與備份

### 10.1 資料備份策略

#### 10.1.1 自動化備份

```python
class BackupManager:
    def __init__(self):
        self.db_client = DatabaseClient()
        self.local_storage = LocalFileStorage()

    async def create_daily_backup(self):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # 1. 資料庫備份
        db_backup = await self.db_client.create_backup()

        # 2. 儲存到本地備份目錄
        backup_path = await self.local_storage.save_backup(
            db_backup,
            f"backups/db_backup_{timestamp}.sql"
        )

        # 3. 記錄備份
        await self.record_backup(backup_path, timestamp)

    async def restore_from_backup(self, backup_path: str):
        # 災難恢復邏輯
        pass
```

### 10.2 故障轉移機制

#### 10.2.1 AI 服務降級

```python
class AIServiceFallback:
    def __init__(self):
        self.primary_service = OpenAIClient()
        self.fallback_responses = FallbackResponseGenerator()

    async def generate_response(self, prompt: str) -> str:
        try:
            return await self.primary_service.complete(prompt)
        except OpenAIServiceError:
            logger.warning("OpenAI service unavailable, using fallback")
            return await self.fallback_responses.generate_generic_response(prompt)
```

## 結論

本技術架構文件定義了 AI 戀愛模擬助手系統的完整技術實現方案。系統採用現代微服務架構，確保高可擴展性、高可用性和用戶隱私保護。

**關鍵技術特點：**

1. **模組化設計** - 各服務獨立開發和部署
2. **多模態 AI 整合** - 統一處理文字、圖片、語音
3. **成本優化** - 智能分層 AI 使用策略
4. **安全至上** - 端到端加密與隱私保護
5. **效能優化** - 多層快取與查詢優化

**下一步行動：**

- 開始 MVP 階段的後端 API 開發
- 建立基礎的助手管理功能
- 整合 OpenAI API 服務
- 實現核心的對話模擬功能
