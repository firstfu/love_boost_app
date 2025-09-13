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

### 1.2 技術棧總覽

**前端：**
- React Native + Expo
- TypeScript
- React Navigation
- Zustand (狀態管理)
- React Query (API 快取)

**後端：**
- FastAPI (Python)
- PostgreSQL + 向量資料庫
- Redis (快取層)
- DigitalOcean 基礎設施

**AI 服務：**
- OpenAI GPT-4o/4o-mini
- OpenAI Whisper + TTS
- OpenAI Vision API

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
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐   │
│  │ GPT-4o/mini │ │   Whisper   │ │     TTS     │ │  Vision  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        資料儲存層                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐   │
│  │ PostgreSQL  │ │ 向量資料庫    │ │    Redis    │ │ 檔案儲存  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 資料流架構

#### 2.2.1 助手建立流程
```
用戶建立助手 → 上傳資料 → AI 分析處理 → 個性檔案生成 → 模擬對話啟用
```

#### 2.2.2 對話模擬流程
```
用戶輸入 → 意圖識別 → 個性檔案匹配 → GPT 回應生成 → 建議生成 → 回傳結果
```

#### 2.2.3 語音通話流程
```
語音輸入 → Whisper 轉文字 → 對話處理 → 回應生成 → TTS 轉語音 → 語音輸出
```

## 3. 核心服務模組設計

### 3.1 身份認證服務 (Auth Service)

#### 3.1.1 功能職責
- Apple Sign-In 整合
- JWT Token 管理
- 用戶權限控制
- 訂閱狀態驗證

#### 3.1.2 資料庫設計
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

#### 3.1.3 API 端點設計
```python
@router.post("/auth/apple-signin")
async def apple_signin(token: str) -> AuthResponse

@router.post("/auth/refresh")
async def refresh_token(refresh_token: str) -> TokenResponse

@router.delete("/auth/logout")
async def logout(current_user: User) -> SuccessResponse
```

### 3.2 AI 助手管理服務 (Assistant Service)

#### 3.2.1 功能職責
- 助手 CRUD 操作
- 助手資料管理
- 權限與限制控制
- 資料隔離機制

#### 3.2.2 資料庫設計
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
- 多模態資料分析
- 個性檔案生成
- 分層 AI 模型管理
- 成本優化策略

#### 3.3.2 分析管道設計
```python
class AnalysisPipeline:
    def __init__(self):
        self.photo_analyzer = PhotoAnalyzer()
        self.text_analyzer = TextAnalyzer()
        self.personality_generator = PersonalityGenerator()

    async def analyze_assistant(self, assistant_id: UUID) -> PersonalityProfile:
        # 1. 圖片分析
        photo_analysis = await self.photo_analyzer.analyze_photos(assistant_id)

        # 2. 文字分析
        text_analysis = await self.text_analyzer.analyze_conversations(assistant_id)

        # 3. 個性檔案生成
        personality = await self.personality_generator.generate_profile(
            photo_analysis, text_analysis
        )

        return personality
```

#### 3.3.3 分層 AI 使用策略
```python
class AIModelManager:
    def __init__(self):
        self.gpt4o = OpenAIClient(model="gpt-4o")
        self.gpt4o_mini = OpenAIClient(model="gpt-4o-mini")

    async def get_analysis(self, complexity: str, prompt: str) -> str:
        if complexity == "deep":
            return await self.gpt4o.complete(prompt)
        else:
            return await self.gpt4o_mini.complete(prompt)
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
        self.model_manager = AIModelManager()
        self.personality_loader = PersonalityLoader()
        self.suggestion_generator = SuggestionGenerator()

    async def generate_response(
        self,
        assistant_id: UUID,
        user_message: str,
        conversation_history: List[Message],
        scenario: str = "casual"
    ) -> ConversationResponse:

        # 載入個性檔案
        personality = await self.personality_loader.load(assistant_id)

        # 建構 prompt
        prompt = self._build_conversation_prompt(
            personality, user_message, conversation_history, scenario
        )

        # 生成回應
        ai_response = await self.model_manager.get_analysis("medium", prompt)

        # 生成建議
        suggestions = await self.suggestion_generator.generate_suggestions(
            user_message, ai_response, personality
        )

        return ConversationResponse(
            ai_response=ai_response,
            suggestions=suggestions,
            scenario=scenario
        )
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
- 語音識別 (STT)
- 文字轉語音 (TTS)
- 語音品質處理
- 即時語音對話

#### 3.5.2 語音處理管道
```python
class VoiceProcessor:
    def __init__(self):
        self.whisper_client = WhisperClient()
        self.tts_client = TTSClient()
        self.audio_processor = AudioProcessor()

    async def process_voice_input(
        self,
        audio_data: bytes,
        assistant_id: UUID
    ) -> VoiceResponse:

        # 1. 語音轉文字
        text = await self.whisper_client.transcribe(audio_data)

        # 2. 對話處理
        conversation_response = await self.conversation_engine.generate_response(
            assistant_id, text, conversation_history=[]
        )

        # 3. 文字轉語音
        audio_response = await self.tts_client.synthesize(
            conversation_response.ai_response
        )

        # 4. 音頻處理
        processed_audio = await self.audio_processor.enhance(audio_response)

        return VoiceResponse(
            transcribed_text=text,
            response_text=conversation_response.ai_response,
            response_audio=processed_audio,
            suggestions=conversation_response.suggestions
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
- CDN 整合

#### 3.6.2 檔案處理管道
```python
class FileProcessor:
    def __init__(self):
        self.storage_client = DigitalOceanSpacesClient()
        self.image_processor = ImageProcessor()
        self.ocr_processor = OCRProcessor()

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

        # 3. 上傳到 CDN
        cdn_url = await self.storage_client.upload(processed_image, assistant_id)

        # 4. 如果是截圖，執行 OCR
        ocr_result = None
        if file_type == "screenshot":
            ocr_result = await self.ocr_processor.extract_text(processed_image)

        return FileUploadResponse(
            file_url=cdn_url,
            ocr_result=ocr_result,
            file_metadata=processed_image.metadata
        )
```

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
    service_type ENUM('gpt4o', 'gpt4o_mini', 'whisper', 'tts', 'vision') NOT NULL,
    tokens_used INTEGER,
    cost_usd DECIMAL(10,4),
    request_timestamp TIMESTAMP DEFAULT NOW(),

    INDEX idx_api_usage_user_id_timestamp (user_id, request_timestamp),
    INDEX idx_api_usage_service_type_timestamp (service_type, request_timestamp)
);
```

### 4.2 向量資料庫設計 (Pinecone/Chroma)

#### 4.2.1 向量儲存策略
```python
# 對話語義向量
conversation_vectors = {
    "assistant_id": "uuid",
    "conversation_id": "uuid",
    "text_chunk": "string",
    "embedding": [float] * 1536,  # OpenAI embedding dimension
    "metadata": {
        "timestamp": "datetime",
        "sentiment": "string",
        "topic": "string"
    }
}

# 個性特徵向量
personality_vectors = {
    "assistant_id": "uuid",
    "feature_type": "string",  # mbti, communication_style, interests
    "feature_value": "string",
    "embedding": [float] * 1536,
    "confidence_score": "float"
}
```

### 4.3 快取策略 (Redis)

#### 4.3.1 快取設計
```python
# 個性檔案快取 (24小時)
personality_cache_key = f"personality:{assistant_id}"

# 對話建議快取 (1小時)
suggestion_cache_key = f"suggestions:{assistant_id}:{message_hash}"

# 用戶訂閱狀態快取 (6小時)
subscription_cache_key = f"subscription:{user_id}"

# API 使用量快取 (1小時)
usage_cache_key = f"usage:{user_id}:{date}"
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
    def __init__(self):
        self.redis = redis.Redis()
        self.local_cache = TTLCache(maxsize=1000, ttl=300)

    async def get_personality(self, assistant_id: UUID) -> Optional[PersonalityProfile]:
        # 1. 本地快取
        if assistant_id in self.local_cache:
            return self.local_cache[assistant_id]

        # 2. Redis 快取
        cached = await self.redis.get(f"personality:{assistant_id}")
        if cached:
            profile = PersonalityProfile.parse_raw(cached)
            self.local_cache[assistant_id] = profile
            return profile

        # 3. 資料庫查詢
        profile = await self.load_from_database(assistant_id)
        if profile:
            await self.redis.setex(
                f"personality:{assistant_id}",
                86400,  # 24 hours
                profile.json()
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
        "redis": await check_redis_connection(),
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
version: '3.8'
services:
  app:
    image: love-boost-api:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

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
        self.storage_client = DigitalOceanSpacesClient()

    async def create_daily_backup(self):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # 1. 資料庫備份
        db_backup = await self.db_client.create_backup()

        # 2. 上傳到儲存空間
        backup_url = await self.storage_client.upload(
            db_backup,
            f"backups/db_backup_{timestamp}.sql"
        )

        # 3. 記錄備份
        await self.record_backup(backup_url, timestamp)

    async def restore_from_backup(self, backup_url: str):
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