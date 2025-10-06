// 1. コアライブラリ
import { useEffect, useState } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode } from '../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { useKeyboardListener } from './useKeyboardListener';
import { useBrailleInputTiming } from './useBrailleInputTiming';
import { useBrailleModeManager } from './useBrailleModeManager';
import { useBrailleOutputProcessor } from './useBrailleOutputProcessor';
import { getCurrentDots, dakuonFuKey } from '../utils/brailleConverter';
import { dotsToHex } from '../utils/dotsToHex';
import { hexToBraille } from '../utils/hexToBraille';
import { getBrailleData } from '../utils/brailleConverter'; // 通常の点字データを取得

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import { brailleCodes, dakuonMap, handakuonMap } from '../data/table'; 

const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

interface UseBrailleLogicProps {
  onOutput: (char: string) => void; // 確定した文字をアプリに追加する関数
  onDisplayUpdate: (data: BrailleData) => void; // 現在の押下状態を表示に反映する関数
  onModeChange: (newMode: InputMode) => void; // ModeDisplayを更新する関数
}

export function useBrailleLogic({ onOutput, onDisplayUpdate, onModeChange }: UseBrailleLogicProps) {
  // 1. キー入力の監視
  const pressedKeys = useKeyboardListener(); 
  
  // 2. タイミング処理 (デバウンス)
  const { stabilizedKeys, isKeysReleased } = useBrailleInputTiming(pressedKeys); // ★ NEW
  
  // 3. モード管理
  // stabilizedKeysが更新されると、モード変更キーの判定（kキー単独押下）が実行される
  const { currentMode, setCurrentMode } = useBrailleModeManager(stabilizedKeys, onModeChange); // ★ NEW

  // 4. 待機データ
  const [pendingData, setPendingData] = useState<BrailleData | null>(null);

  // 5. 確定ロジック (Processorの初期化)
  const { processOutput } = useBrailleOutputProcessor(
    pendingData,
    currentMode,
    onOutput,
    onModeChange,
    setCurrentMode
  );

  // -----------------------------------------------------
  // useEffect: メインロジック
  // -----------------------------------------------------
  useEffect(() => {
    // A. キーが全て離された場合（確定処理）
    if (isKeysReleased) {
      if (pendingData) {
        // Processorを呼び出し、確定処理を実行。
        const isModeMaintained = processOutput();
        
        // 処理の結果、モードが維持された（濁音符単独入力）場合を除き、pendingDataをリセット
        // 濁音符単独入力時は、processOutput内で pendingData/Display のクリアが完了している
        if (!isModeMaintained) {
          setPendingData(null); 
          onDisplayUpdate({ character: '', braille: '', dots: [] });
        }
      } else {
        // pendingDataがない状態でキーが離された場合も表示をクリア
        onDisplayUpdate({ character: '', braille: '', dots: [] });
      }
      return;
    }

    // B. 安定したキー入力があった場合 (stabilizedKeysが更新されたとき)
    if (stabilizedKeys) {
      const currentDots = getCurrentDots(stabilizedKeys);
      const keys = Array.from(stabilizedKeys);

      // モード変更キー（k, lなど）は useBrailleModeManager 側で処理されるため、
      // ここでは通常の点字入力を処理する。
      
      const isModeKeyOnly = keys.length === 1 && (keys[0] === 'k' || keys[0] === 'l');
      
      if (!isModeKeyOnly) {
          // 2. 通常の点字入力判定 
          const characterData = getBrailleData(stabilizedKeys);

          if (characterData !== null) {
            onDisplayUpdate(characterData);
            setPendingData(characterData);
          } else {
            // 不明な点字の表示ロジック
            // ... (既存の不明な点字ロジックをここに移植)
            let brailleText = '';
            if (currentDots.length > 0) {
              brailleText = hexToBraille(dotsToHex(currentDots)); 
            }
            
            const displayData: BrailleData = {
                character: '不明',
                braille: brailleText,
                dots: currentDots,
            };

            onDisplayUpdate(displayData);
            setPendingData(displayData);
          }
      } else {
        
      }
    }
    
  }, [isKeysReleased, stabilizedKeys, currentMode, pendingData, onDisplayUpdate, setPendingData, processOutput]);

  return { pressedKeys, currentMode };
}