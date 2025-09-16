/**
 * 訊息分析服務
 * 提供AI分析對方訊息的功能
 */

interface MessageAnalysis {
  emotion: string;
  tone: string;
  interest_level: number;
  suggested_response_style: string;
  key_insights: string[];
  recommended_actions: string[];
}

export const analyzeMessage = async (message: string): Promise<MessageAnalysis> => {
  // 模擬API延遲
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // 簡單的關鍵字分析來模擬AI分析
  const analysis = generateMockAnalysis(message);

  console.log('分析結果:', analysis);

  return analysis;
};

const generateMockAnalysis = (message: string): MessageAnalysis => {
  const lowerMessage = message.toLowerCase();

  // 情緒分析
  let emotion = "curious";
  let tone = "inquisitive";
  let interest_level = 75;

  if (lowerMessage.includes("開心") || lowerMessage.includes("好棒") || lowerMessage.includes("太好了")) {
    emotion = "happy";
    tone = "excited";
    interest_level = 85;
  } else if (lowerMessage.includes("累") || lowerMessage.includes("辛苦")) {
    emotion = "tired";
    tone = "caring";
    interest_level = 60;
  } else if (lowerMessage.includes("想你") || lowerMessage.includes("想念")) {
    emotion = "romantic";
    tone = "loving";
    interest_level = 90;
  } else if (lowerMessage.includes("？") || lowerMessage.includes("?") || lowerMessage.includes("什麼") || lowerMessage.includes("哪裡") || lowerMessage.includes("怎麼")) {
    emotion = "curious";
    tone = "inquisitive";
    interest_level = 80;
  } else if (lowerMessage.includes("哈") || lowerMessage.includes("呵") || lowerMessage.includes("嗨")) {
    emotion = "happy";
    tone = "playful";
    interest_level = 70;
  }

  // 根據訊息內容生成洞察和建議
  const insights = generateInsights(message, emotion);
  const actions = generateActions(emotion, interest_level);
  const responseStyle = generateResponseStyle(emotion, tone);

  return {
    emotion,
    tone,
    interest_level,
    suggested_response_style: responseStyle,
    key_insights: insights,
    recommended_actions: actions,
  };
};

const generateInsights = (message: string, emotion: string): string[] => {
  const insights = [];

  if (message.includes("工作")) {
    insights.push("對方提到工作，可能需要關心和支持");
  }

  if (message.includes("今天")) {
    insights.push("正在分享當天的經歷，表示願意與你交流");
  }

  if (message.length > 50) {
    insights.push("訊息較長，顯示對話投入度較高");
  }

  if (message.includes("你")) {
    insights.push("主動提到你，表示對你有關注");
  }

  if (emotion === "romantic") {
    insights.push("表達思念之情，感情升溫的好時機");
  }

  return insights.length > 0 ? insights : ["對方願意主動分享，表示對你有一定信任"];
};

const generateActions = (emotion: string, interestLevel: number): string[] => {
  const actions = [];

  if (emotion === "tired") {
    actions.push("表達關心，詢問是否需要幫助");
    actions.push("建議放鬆活動或休息");
  } else if (emotion === "happy") {
    actions.push("分享對方的快樂，延續正面情緒");
    actions.push("趁機提出一起做開心的事");
  } else if (emotion === "romantic") {
    actions.push("回應思念之情，增進親密感");
    actions.push("提議見面或視訊通話");
  } else {
    actions.push("積極回應，保持對話活躍");
    if (interestLevel > 70) {
      actions.push("可以嘗試深入話題或分享個人經歷");
    }
  }

  return actions;
};

const generateResponseStyle = (emotion: string, tone: string): string => {
  if (emotion === "tired") {
    return "使用溫暖關懷的語調，避免太過活潑，重點放在理解和支持";
  } else if (emotion === "happy") {
    return "配合對方的開心情緒，使用積極正面的語言，可以適度使用表情符號";
  } else if (emotion === "romantic") {
    return "回應浪漫情緒，使用溫柔甜蜜的語調，表達相同的情感";
  } else if (emotion === "curious") {
    return "耐心回答問題，提供有趣的細節，可以反問相關問題延續話題";
  } else {
    return "保持友善輕鬆的語調，根據話題內容調整回應深度";
  }
};