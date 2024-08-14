async function callGeminiAPI(action: string, data: any) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const result = await response.json();
  return result.result;
}

export const updateSVGWithGemini = async (currentCode: string, instruction: string) => {
  return callGeminiAPI('updateSVGWithGemini', { currentCode, instruction });
};
