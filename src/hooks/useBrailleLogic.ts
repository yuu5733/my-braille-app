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
        // 1. 待機データがあれば、確定処理を実行する
        const isModeMaintained = processOutput();
        
        // 2. 確定処理後に入力待ちの状態をリセットする
        // 濁音符入力モードなどではなくなった時に、pendingDataをリセット
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

      // モードキー単独の判定（kキー or lキー単独押下）
      const isModeKeyOnly = keys.length === 1 && (keys[0] === 'k' || keys[0] === 'l');
      
      if (isModeKeyOnly) {
          if (keys[0] === dakuonFuKey) { // 'k' キー単独
            const dakuonBraille = hexToBraille(brailleCodes.dakuonFu); // 濁音符の点字
            
            // 1. モードをDakuonに更新（Context経由）
            setCurrentMode('Dakuon');
            
            // 2. 表示データ（pendingData）を「濁音符」として更新（キーを離す前の表示）
            const displayData: BrailleData = { 
                character: '濁音符', 
                braille: dakuonBraille, 
                dots: currentDots 
            };
            
            onDisplayUpdate(displayData);
            setPendingData(displayData);
          }
          // (lキーなどの半濁音符ロジックもここに追加)
          return; // モードキー単独の場合はこれ以降の通常点字判定は行わない
      } else {
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
      }
    }
    
  }, [isKeysReleased, stabilizedKeys, currentMode, pendingData, onDisplayUpdate, setPendingData, processOutput]);

  return { pressedKeys, currentMode };
}