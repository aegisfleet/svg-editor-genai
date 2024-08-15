import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';

interface GeminiInputProps {
  onSubmit: (instruction: string) => void;
  clearTrigger: number;
}

const GeminiInput: React.FC<GeminiInputProps> = ({ onSubmit, clearTrigger }) => {
  const [instruction, setInstruction] = useState('');

  const sampleInstructions = [
    "【指示のサンプル】",
    "デザインは変更せずに基調色を赤にして欲しい。",
    "テキストの位置をもう少し左上にして欲しい。",
    "シンプルでモダンなデザインにして欲しい。",
    "現在のデザインをベースにテーマの異なる画像を5つ作成して欲しい。"
  ];

  useEffect(() => {
    setInstruction('');
  }, [clearTrigger]);

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (instruction.trim()) {
      onSubmit(instruction.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== sampleInstructions[0]) {
      setInstruction(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <select
        onChange={handleSelectChange}
        className="w-full p-3 border rounded-lg shadow-sm mb-2 bg-white text-gray-700 cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
        value={sampleInstructions.includes(instruction) ? instruction : sampleInstructions[0]}
      >
        {sampleInstructions.map((sample, index) => (
          <option key={index} value={sample} className={index === 0 ? "text-gray-500" : ""}>
            {sample}
          </option>
        ))}
      </select>
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter instructions for SVG..."
        className="w-full p-3 border rounded-lg shadow-sm mb-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        rows={3}
      />
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
