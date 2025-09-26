// src/components/BrailleApp.tsx

import React, { useState } from 'react';
import BrailleInput from "./BrailleInput";
import ResultDisplay from "./ResultDisplay";
import type { BrailleData } from '../data/types';

const BrailleApp: React.FC = () => {
  const [character, setCharacter] = useState('');
  const [braille, setBraille] = useState('');
  const [dots, setDots] = useState<number[]>([]);
  
  // onCharacterConfirmを更新して、ひらがな、点字、数字データを受け取る
  const handleConfirm = (data: BrailleData) => {
    setCharacter(data.character);
    setBraille(data.braille);
    setDots(data.dots);
  };

  return (
    <>
      <h1>指点字練習アプリ</h1>
      <BrailleInput onConfirm={handleConfirm} />
      <ResultDisplay text={character} brailleText={braille} dots={dots} />
    </>
  );
};

export default BrailleApp;