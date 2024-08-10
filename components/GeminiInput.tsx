import React, { FormEvent, KeyboardEvent, useState } from 'react';

interface GeminiInputProps {
  onSubmit: (instruction: string) => void;
}

const GeminiInput: React.FC<GeminiInputProps> = ({ onSubmit }) => {
  const [instruction, setInstruction] = useState('');

  const sampleInstructions = [
    "基調色を赤にして",
    "背景に円形のグラデーションを追加",
    "テキストを大きくして中央に配置",
    "SVGに星形を追加",
    "全体的なデザインをモダンにリニューアル"
  ];

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (instruction.trim()) {
      onSubmit(instruction.trim());
      setInstruction('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSampleClick = (sample: string) => {
    setInstruction(sample);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter instructions for SVG..."
        className="w-full p-3 border rounded-lg shadow-sm mb-2"
        rows={3}
      />
      <div className="flex flex-wrap gap-2 mb-2">
        {sampleInstructions.map((sample, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSampleClick(sample)}
            className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>
      <button 
        type="submit" 
        className={`w-full p-3 rounded-lg shadow-md transition-colors ${instruction.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} 
        disabled={!instruction.trim()}
      >
        Update SVG (Ctrl + Enter)
      </button>
    </form>
  );
};

export default GeminiInput;
