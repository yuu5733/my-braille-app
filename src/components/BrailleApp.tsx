// src/components/BrailleApp.tsx

import React, { useState } from 'react';
import BrailleInput from "./BrailleInput";
import ResultDisplay from "./ResultDisplay";

const BrailleApp: React.FC = () => {
  const [result, setResult] = useState('');

  const handleCharacterConfirm = (char: string) => {
    setResult(char);
  };

  return (
    <>
      <h1>指点字練習アプリ</h1>
      <BrailleInput onCharacterConfirm={handleCharacterConfirm} />
      <ResultDisplay text={result} />
    </>
  );
};

export default BrailleApp;