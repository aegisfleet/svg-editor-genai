import Head from 'next/head';
import { useEffect, useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ErrorDialog from '../components/ErrorDialog';
import GeminiInput from '../components/GeminiInput';
import LoadingDialog from '../components/LoadingDialog';
import SVGPreview from '../components/SVGPreview';
import { updateSVGWithGemini } from '../utils/geminiApi';

const Home = () => {
  const [svgCode, setSvgCode] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <circle cx="25" cy="26" r="23" fill="#233e96" opacity="0.5"/>

  <circle id="mainCircle" cx="25" cy="25" r="23" fill="url(#radialGradient)"/>

  <defs>
    <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4A90E2"/>
      <stop offset="100%" stop-color="#2958A1"/>
    </radialGradient>
  </defs>

  <text y="34" transform="rotate(-20 25 25)">
    <tspan x="10.5" fill="url(#gradientText)" font-family="Arial Black" font-size="16" alignment-baseline="middle" dominant-baseline="middle">S</tspan>
    <tspan x="21" fill="url(#gradientText)" font-family="Arial Black" font-size="16" alignment-baseline="middle" dominant-baseline="middle">V</tspan>
    <tspan x="32" fill="url(#gradientText)" font-family="Arial Black" font-size="16" alignment-baseline="middle" dominant-baseline="middle">G</tspan>
  </text>

  <defs>
    <linearGradient id="gradientText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>
</svg>`;
    setSvgCode(initialCode);
    setHistory([initialCode]);
    setCurrentIndex(0);
  }, []);

  const updateCode = (newCode: string) => {
    setSvgCode(newCode);
    setHistory(prev => [...prev.slice(0, currentIndex + 1), newCode]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSvgCode(history[currentIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSvgCode(history[currentIndex + 1]);
    }
  };

  const handleClear = () => {
    const clearedCode = '';
    setSvgCode(clearedCode);
    setHistory(prev => [...prev.slice(0, currentIndex + 1), clearedCode]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleGeminiUpdate = async (instruction: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCode = await updateSVGWithGemini(svgCode, instruction);
      updateCode(updatedCode);
    } catch (error) {
      console.error('Error updating code with Gemini:', error);
      setError('Failed to update code with Gemini. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Head>
        <title>SVG Editor GenAI</title>
      </Head>
      <header className="bg-blue-600 text-white p-4 flex items-center">
        <img src="/favicon.svg" alt="App Icon" className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">SVG Editor GenAI</h1>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 bg-white shadow-lg">
          <CodeEditor
            code={svgCode}
            onChange={updateCode}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
          />
        </div>
        <div className="w-1/2 p-4 bg-white shadow-lg flex flex-col">
          <SVGPreview code={svgCode} />
        </div>
      </main>
      <footer className="bg-gray-200 p-4">
        <GeminiInput onSubmit={handleGeminiUpdate} />
      </footer>
      <LoadingDialog isOpen={isLoading} />
      <ErrorDialog isOpen={error !== null} message={error || ''} onClose={() => setError(null)} />
    </div>
  );
};

export default Home;
