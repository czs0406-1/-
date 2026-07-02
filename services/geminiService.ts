import { DrugAnalysis } from "../types";

export async function analyzeDrug(input: string | { data: string, mimeType: string }): Promise<DrugAnalysis> {
  const drugName = typeof input === 'string' ? input : '';
  
  if (!drugName) {
    throw new Error("由于 DeepSeek API 暂不支持图片/视觉识别，请直接输入药物或草本名称进行唤醒。");
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ drugName })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error_message || `请求失败 (HTTP ${response.status})`);
  }

  const result = await response.json() as DrugAnalysis;
  if (result.status === 'error') {
    throw new Error(result.error_message || "此物尚未开启灵智。");
  }

  return result;
}
