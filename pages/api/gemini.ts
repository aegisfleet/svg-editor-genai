import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  maxDuration: 60,
};

const getModelName = () => process.env.GEMINI_MODEL || "gemini-3-flash-preview";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "GEMINI_API_KEY is not set in environment variables" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const { action, data } = req.body;

  try {
    let result;
    switch (action) {
      case 'updateSVGWithGemini':
        result = await updateSVGWithGemini(genAI, data.currentCode, data.instruction);
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    res.status(200).json({ result });
  } catch (error: unknown) {
    console.error('Error in Gemini API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ message: errorMessage });
  }
}

const updateSVGWithGemini = async (genAI: GoogleGenerativeAI, currentCode: string, instruction: string) => {
  const model = genAI.getGenerativeModel({ model: getModelName() });

  const prompt = `
以下の指示に基づいて、SVG形式の画像を高品質に更新する。

仕様:
- 現在のSVGコードが指定されていない場合は指示の内容に基づき新規にSVG画像を作成する。
- 綺麗なレイアウトと均衡の取れたデザインで生成する。
- 適切な色使いとシンプルで美しい形状にする。
- 不要なコードやコメントは含めない。
- 更新されたSVG画像のみを返す。

指示:
${instruction}

現在のSVGコード:
\`\`\`svg
${currentCode}
\`\`\`
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

