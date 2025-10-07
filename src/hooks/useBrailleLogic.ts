// 1. コアライブラリ
import { useEffect, useState } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode } from '../data/types'; 

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { useBrailleContext } from '../contexts/BrailleContext';
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

export function useBrailleLogic() {
  // 1. キー入力の監視
  const pressedKeys = useKeyboardListener(); 

  const { 
    currentMode, 
    setCurrentMode, 
    pendingData, 
    setPendingData, 
    onOutput, 
    onDisplayUpdate, 
  } = useBrailleContext();

  // 2. タイミング処理 (デバウンス)
  const { stabilizedKeys, isKeysReleased } = useBrailleInputTiming(pressedKeys); // ★ NEW
  
  // 3. モード管理
  // stabilizedKeysが更新されると、モード変更キーの判定（kキー単独押下）が実行される
  // currentMode, setCurrentModeでuseContextから取り出す

  // 4. 待機データ
  // pendingData, setPendingDataから取り出す

  // 5. 確定ロジック (Processorの初期化)
  const { processOutput } = useBrailleOutputProcessor(
    pendingData,
    currentMode,
    onOutput,
    setCurrentMode,
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
        // モードキー単独入力時、useBrailleModeManager側でモード変更が行われているが、
        // pendingDataの更新も必要（例: 濁音符の表示）
        // 実際には useBrailleModeManager 側で pendingData も更新させる方がシンプルだが、
        // 一旦は modeManager が mode の更新のみを行うと仮定する。
        // （元のコードの pendingData 更新ロジックは timing 側で処理すべき）
        // 複雑になるため、ここでは元のコードの B-1 ロジック（pendingData更新）をここに戻すか、
        // useBrailleModeManager 側に移します。
        
        // ★元のコードの B-1 ロジックをここに記述するか、タイミングに含める必要があります。
        // ここでは、timingフックが安定したキーセットを渡すだけで、モード判定は manager に委ねる方針を維持し、
        // 濁音符の表示ロジックは modeManager に移すことでシンプルにします。
        
      }
    }
    
  }, [isKeysReleased, stabilizedKeys, currentMode, pendingData, onDisplayUpdate, setPendingData, processOutput]);

  return { pressedKeys, currentMode };
}