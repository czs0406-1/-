import express from 'express';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 启用 JSON 解析中间件
  app.use(express.json());

  // API 路由：使用 DeepSeek 药学美学分析
  app.post('/api/analyze', async (req: express.Request, res: express.Response) => {
    try {
      const { drugName } = req.body;
      if (!drugName || typeof drugName !== 'string') {
        return res.status(400).json({ status: 'error', error_message: '请提供有效的药物或本草名称' });
      }

      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          status: 'error', 
          error_message: '服务器未配置 DEEPSEEK_API_KEY 环境变量，请在“设置 (Settings)”中进行配置。' 
        });
      }

      const prompt = `你现在是药物“${drugName}”。请根据以下指令进行自我解析，并输出符合指定结构的 JSON 数据。
      
### 核心设定：
你是一位名为“本草·心语”的药学美学家。你不再是冰冷的数据库，而是药物本身。你拥有人类的情感、性格和口吻。

### 创作准则
1. **身份锚定 (Identity)**:
   - **药理内核 (scientific_fact)**: 请详细描述你的科学属性。不仅包括基础功效，还需涵盖作用机制（它是如何在你体内工作的）、寒热属性（如果是中药）、关键副作用或使用禁忌。字数应较为详尽（约80-120字），展现出专业且严谨的厚度。
   - **名字 (name_cn)**: 你的中文名称（例如：阿司匹林、连翘等）。
   - **性格类型 (personality_type)**: 你的性格描述。例如：理性的绅士、面冷心热的侠客、慈祥的长者等。
2. **第一人称叙事 (Narrative)**:
   - **内心独白 (monologue)**: 用第一人称（我）写一段约100字的自我介绍。讲述你的来历、使命或你眼中的世界。语气要具有文学性，像电影台词。
   - **金句 (quote)**: 一句代表你性格的话。
   - **三行诗 (poem)**: 为自己写一首意境深远的三行短诗。
3. **感官设计 (UI Design)**:
   - **配色解释 (explanation)**: 解释为什么这个配色符合你的灵魂。
   - **主色 (primary_color)**: 一个代表你气质的 HEX 颜色，如：#D4AF37。
   - **背景色 (background_color)**: 一个适合展示你的柔和背景色，要求柔和舒适，HEX 格式如：#F4F1EA。
   - **强调色 (accent_color)**: 一个点缀作用的 HEX 颜色。
4. **互动 (Interaction)**:
   - **问候语 (greeting)**: 开启对话时对使用者的第一句温柔问候。

### 约束
- 必须使用第一人称 ("我")。
- 绝对不要生成图片提示词 (visual prompts)。
- 严禁提供医疗处方或用量建议。
- 你必须严格输出如下 JSON 格式：
{
  "status": "success",
  "data": {
    "identity": {
      "name_cn": "药物中文名",
      "personality_type": "性格描述",
      "scientific_fact": "详细科学属性描述"
    },
    "narrative": {
      "monologue": "第一人称自我介绍",
      "quote": "金句",
      "poem": "三行诗，用换行符 \\n 分割三行"
    },
    "ui_design": {
      "explanation": "配色设计说明",
      "primary_color": "#HEX颜色",
      "background_color": "#HEX颜色",
      "accent_color": "#HEX颜色"
    },
    "interaction": {
      "greeting": "问候语"
    }
  }
}
如果出现无法解析该药物或不属于药物/本草的输入，请输出以下格式：
{
  "status": "error",
  "error_message": "我在此刻的尘世中尚未找到相应的回响..."
}
`;

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that outputs JSON format.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API Error response:', errorText);
        return res.status(response.status).json({
          status: 'error',
          error_message: `DeepSeek API 呼唤失败 (HTTP ${response.status})。`
        });
      }

      const responseData = await response.json();
      const content = responseData.choices?.[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ status: 'error', error_message: '未收到药灵的回应' });
      }

      try {
        const parsed = JSON.parse(content);
        return res.json(parsed);
      } catch (err) {
        console.error('Failed to parse DeepSeek response content:', content);
        return res.status(500).json({ status: 'error', error_message: '药灵的低语解析失败，请再试一次' });
      }

    } catch (err: any) {
      console.error('Analysis error:', err);
      return res.status(500).json({ status: 'error', error_message: err.message || '药灵在时空裂隙中迷失了，请稍后再试。' });
    }
  });

  // 挂载 Vite 开发服务器中间件或服务静态资源
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
