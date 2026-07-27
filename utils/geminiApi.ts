async function callGeminiAPI(action: string, data: any) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    if (response.status === 504) {
      throw new Error("API request timed out (504 Gateway Timeout). Please try again or simplify your instruction.");
    }
    let errorMessage = `API request failed: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result.result;
}

export const updateSVGWithGemini = async (currentCode: string, instruction: string) => {
  return callGeminiAPI('updateSVGWithGemini', { currentCode, instruction });
};
