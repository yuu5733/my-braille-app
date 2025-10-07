// 1. コアライブラリ
import { useState, useCallback, useMemo } from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData, InputMode } from '../data/types';
import type { BrailleContextType } from '../contexts/BrailleContext';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { BrailleContext, useBrailleContext } from '../contexts/BrailleContext'; 
import { useBrailleLogic } from '../hooks/useBrailleLogic';
import BrailleInput from "./BrailleInput";
import ResultDisplay from "./ResultDisplay";
import ModeDisplay from './ModeDisplay'; 

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット

// -----------------------------------------------------
// ★ 内部コンポーネント (Contextの消費者) を定義
// -----------------------------------------------------
const BrailleAppContent: FC = () => {
  const { currentMode, character, braille, dots, outputString } = useBrailleContext();

  const { pressedKeys } = useBrailleLogic();

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

// -----------------------------------------------------
// ★ BrailleAppがProviderの役割を果たす (State管理をここに移植)
// -----------------------------------------------------
const BrailleApp: FC = () => {
    const [currentMode, setCurrentMode] = useState<InputMode>('Kana');

    const [pendingData, setPendingData] = useState<BrailleData | null>(null);

    const [character, setCharacter] = useState('');
    const [braille, setBraille] = useState('');
    const [dots, setDots] = useState<number[]>([]);

    const [outputString, setOutputString] = useState('');
    
    // ロジック定義
    const handleOutput = useCallback((char: string) => {
        if (char !== '濁音符' && char !== '不明') {
            setOutputString(prev => prev + char);
        }
    }, []);
    
    const handleDisplayUpdate = useCallback((data: BrailleData) => {
        setCharacter(data.character);
        setBraille(data.braille);
        setDots(data.dots);
    }, []);

    // ContextValueはuseMemoで安定させる
    const contextValue: BrailleContextType = useMemo(() => ({
        currentMode, setCurrentMode,
        pendingData, setPendingData,
        onOutput: handleOutput, 
        onDisplayUpdate: handleDisplayUpdate,
        character,   // ResultDisplay表示用（非必須だが便利）
        braille,     // ResultDisplay表示用
        dots,        // ResultDisplay表示用
        outputString,// ResultDisplay表示用
    }), [currentMode, pendingData, handleOutput, handleDisplayUpdate, character, braille, dots, outputString]);

    // Providerとして自分自身をラップし、コンテンツコンポーネントを描画
    return (
        <BrailleContext.Provider value={contextValue}>
            <BrailleAppContent />
        </BrailleContext.Provider>
    );
};

export default BrailleApp;