import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const updateSVGWithGemini = async (currentCode: string, instruction: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
