import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action, data } = req.body;

  try {
    let result;
    switch (action) {
      case 'updateSVGWithGemini':
        result = await updateSVGWithGemini(data.currentCode, data.instruction);
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateSVGWithGemini = async (currentCode: string, instruction: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
以下の指示に基づいて、SVG形式の画像を高品質に更新する。

仕様:
- 更新されたSVG画像のみを返す。
- 綺麗なレイアウトと均衡の取れたデザインを保持する。
- 最終的なSVGは視覚的に魅力的であること。
- 適切な色使いとシンプルで美しい形状にする。
- 不要なコードやコメントは含めないこと。

指示:
${instruction}

現在のSVGコード:
${currentCode}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let updatedCode = response.text();

    updatedCode = updatedCode.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();

    return updatedCode;
  } catch (error) {
    console.error("Error updating SVG with Gemini:", error);
    throw error;
  }
};