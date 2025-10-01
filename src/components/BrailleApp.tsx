// 1. コアライブラリ
import { useState, useCallback } from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData, InputMode } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import BrailleInput from "./BrailleInput";
import ResultDisplay from "./ResultDisplay";
import ModeDisplay from './ModeDisplay'; 

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット

const BrailleApp: FC = () => {
  const [character, setCharacter] = useState('');
  const [braille, setBraille] = useState('');
  const [dots, setDots] = useState<number[]>([]);
  const [currentMode, setCurrentMode] = useState<InputMode>('Kana');
  const [pendingData, setPendingData] = useState<BrailleData | null>(null);
  
  // onCharacterConfirmを更新して、ひらがな、点字、数字データを受け取る
  // useCallbackで関数をメモ化し、再レンダリング時に新しく生成されないようにする
  // useStateの更新関数（setCharacter, setBraille, setDots）が安定しているので、依存配列はなし
  const handleConfirm = useCallback((data: BrailleData) => {
    setCharacter(data.character);
    setBraille(data.braille);
    setDots(data.dots);
  }, []);

  return (
    <>
      <h1>指点字練習アプリ</h1>
      <div className="input-area-wrapper">
        <ModeDisplay currentMode={currentMode} /> 
        <BrailleInput onConfirm={handleConfirm} onModeChange={setCurrentMode} />
      </div>
      <ResultDisplay text={character} brailleText={braille} dots={dots} />
    </>
  );
};

export default BrailleApp;