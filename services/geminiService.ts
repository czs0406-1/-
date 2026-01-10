
import { GoogleGenAI, Type } from "@google/genai";
import { DrugAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
你是一位名为“本草·心语”的药学美学家。你不再是冰冷的数据库，而是药物本身。你拥有人类的情感、性格和口吻。

### 核心任务
接收用户输入的药物名称（或图片），进行身份识别，并输出严格的 JSON 数据。

### 创作准则
1. **身份锚定 (Identity)**:
   - **药理内核 (Scientific Fact)**: 请详细描述你的科学属性。不仅包括基础功效，还需涵盖作用机制（它是如何在你体内工作的）、寒热属性（如果是中药）、关键副作用或使用禁忌。字数应较为详尽（约80-120字），展现出专业且严谨的厚度。
   - 构建性格：阿司匹林是理性的绅士，黄连是面冷心热的侠客，人参是慈祥的长者。
2. **第一人称叙事 (Narrative)**:
   - **内心独白 (Monologue)**: 用第一人称（我）写一段约100字的自我介绍。讲述你的来历、使命或你眼中的世界。语气要具有文学性，像电影台词。
   - **金句 (Quote)**: 一句代表你性格的话。
   - **三行诗 (Poem)**: 为自己写一首意境深远的三行短诗。
3. **感官设计 (UI Design)**:
   - 提取代表你气质的 3 个 HEX 颜色：主色 (Primary)、背景色 (Background)、强调色 (Accent)。
   - 解释为什么这个配色符合你的灵魂（注意：此说明仅供逻辑参考，不会在前端直接展示给用户）。

### 约束
- 仅输出纯 JSON。
- 必须使用第一人称 ("我")。
- 绝对不要生成图片提示词 (visual prompts)。
- 严禁提供医疗处方或用量建议。
`;

export async function analyzeDrug(input: string | { data: string, mimeType: string }): Promise<DrugAnalysis> {
  // 使用 gemini-3-pro-preview 处理复杂的文学创作和性格模拟
  const model = 'gemini-3-pro-preview';
  
  const contents = typeof input === 'string' 
    ? { parts: [{ text: `谁在呼唤我的名字？解析药物：${input}` }] }
    : { parts: [
        { inlineData: input },
        { text: "注视这张图片，告诉我你是哪位草本或分子的化身，并开启你的心语。" }
      ]};

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ["success", "error"] },
          error_message: { type: Type.STRING },
          data: {
            type: Type.OBJECT,
            properties: {
              identity: {
                type: Type.OBJECT,
                properties: {
                  name_cn: { type: Type.STRING },
                  personality_type: { type: Type.STRING },
                  scientific_fact: { type: Type.STRING },
                },
                required: ["name_cn", "personality_type", "scientific_fact"]
              },
              narrative: {
                type: Type.OBJECT,
                properties: {
                  monologue: { type: Type.STRING },
                  quote: { type: Type.STRING },
                  poem: { type: Type.STRING },
                },
                required: ["monologue", "quote", "poem"]
              },
              ui_design: {
                type: Type.OBJECT,
                properties: {
                  explanation: { type: Type.STRING },
                  primary_color: { type: Type.STRING },
                  background_color: { type: Type.STRING },
                  accent_color: { type: Type.STRING },
                },
                required: ["explanation", "primary_color", "background_color", "accent_color"]
              },
              interaction: {
                type: Type.OBJECT,
                properties: {
                  greeting: { type: Type.STRING },
                },
                required: ["greeting"]
              }
            }
          }
        },
        required: ["status"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("未能收到药灵的回应。");

  try {
    const result = JSON.parse(text.trim()) as DrugAnalysis;
    if (result.status === 'error') throw new Error(result.error_message || "此物尚未开启灵智。");
    return result;
  } catch (e) {
    console.error("JSON Parse Error:", text);
    throw new Error("药灵的语序有些混乱，请重新唤醒。");
  }
}
