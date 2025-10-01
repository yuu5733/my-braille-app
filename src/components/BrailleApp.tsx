// 1. コアライブラリ
import { useState, useCallback } from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData, InputMode } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { useBrailleLogic } from '../hooks/useBrailleLogic';
import BrailleInput from "./BrailleInput";
import ResultDisplay from "./ResultDisplay";
import ModeDisplay from './ModeDisplay'; 

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット

const BrailleApp: FC = () => {
  const [character, setCharacter] = useState('');
  const [braille, setBraille] = useState('');
  const [dots, setDots] = useState<number[]>([]);
  // outputString: 確定した文字を保持するState
  const [outputString, setOutputString] = useState(''); 
  const [currentMode, setCurrentMode] = useState<InputMode>('Kana');
  //const [pendingData, setPendingData] = useState<BrailleData | null>(null);


  // onCharacterConfirmを更新して、ひらがな、点字、数字データを受け取る
  // useCallbackで関数をメモ化し、再レンダリング時に新しく生成されないようにする
  // useStateの更新関数（setCharacter, setBraille, setDots）が安定しているので、依存配列はなし
  const handleDisplayUpdate = useCallback((data: BrailleData) => {
    setCharacter(data.character);
    setBraille(data.braille);
    setDots(data.dots);
  }, []);

  // 確定文字を追加するロジック
  const handleOutput = useCallback((char: string) => {
    // 濁音符が確定した場合は文字列に追加しない（後で適切なロジックを実装）
    // 現時点では、'濁音符'が確定したら追加しないロジックを追加
    if (char !== '濁音符' && char !== '不明') {
      setOutputString(prev => prev + char);
    }
  }, []);

  const { pressedKeys } = useBrailleLogic({
    onOutput: handleOutput,
    onDisplayUpdate: handleDisplayUpdate,
    onModeChange: setCurrentMode,
  });

  return (
    <>
      <h1>指点字練習アプリ</h1>
      <div className="input-area-wrapper">
        <ModeDisplay currentMode={currentMode} /> 
        <BrailleInput pressedKeys={pressedKeys} />
      </div>
      {/* 確定された文字を表示するための新しい領域 (デバッグ用) */}
      <div style={{ padding: '10px', border: '1px solid #ccc', margin: '1rem 0' }}>
        確定済み: {outputString}
      </div> 
      <ResultDisplay text={character} brailleText={braille} dots={dots} />
    </>
  );
};

export default BrailleApp;