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
import { getCurrentDots } from '../utils/brailleConverter';
import { dakuonFuKey, handakuonFuKey, youonFuKey } from '../data/brailleMappings';
import { dotsToHex } from '../utils/dotsToHex';
import { hexToBraille } from '../utils/hexToBraille';
import { getBrailleData } from '../utils/brailleConverter'; // 通常の点字データを取得

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット
import { brailleCodes } from '../data/table'; 

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
      // const isModeKeyOnly = keys.length === 1 && (keys[0] === 'k' || keys[0] === 'l');

      const isDakuonOnly = keys.length === 1 && keys[0] === dakuonFuKey;     // k単独
      const isHandakuonOnly = keys.length === 1 && keys[0] === handakuonFuKey; // l単独
      
      const isYouonOnly = keys.length === 1 && keys[0] === youonFuKey;         // j単独 (拗音)
      const isYouDakuon = keys.length === 2 && keys.includes(youonFuKey) && keys.includes(dakuonFuKey); // j + k (拗濁音)
      const isYouHandakuon = keys.length === 2 && keys.includes(youonFuKey) && keys.includes(handakuonFuKey); // j + l (拗半濁音)

      if (isDakuonOnly) { 
        // 濁音 ('k' 単独)
        const braille = hexToBraille(brailleCodes.dakuonFu);
        setCurrentMode('Dakuon'); // 1. モードを更新（Context経由）
        onDisplayUpdate({ character: '濁音符', braille, dots: currentDots });
        setPendingData({ character: '濁音符', braille, dots: currentDots });
        return; 
      } 
      else if (isHandakuonOnly) {
        // 半濁音 ('l' 単独)
        const braille = hexToBraille(brailleCodes.handakuonFu);
        setCurrentMode('Handakuon');
        onDisplayUpdate({ character: '半濁音符', braille, dots: currentDots });
        setPendingData({ character: '半濁音符', braille, dots: currentDots });
        return;
      }
       else if (isYouonOnly || isYouDakuon || isYouHandakuon) {
        // ★★★ 拗音系モードの処理（修正部分） ★★★
        let mode: InputMode;
        let char: string; // 表示用文字（'拗音符', '拗濁音符'など）
        let code: number; // 表示に使う点字コード

        if (isYouonOnly) {
          mode = 'Youon';
          char = '拗音符';
          code = brailleCodes.youonFu; // 点4
        } else if (isYouDakuon) {
          mode = 'YouDakuon';
          // ★修正: 表示文字を「拗濁音符」に設定
          char = '拗濁音符'; 
          // 拗濁音符は「点4 + 点5」の複合点字だが、ここでは単一の点字コード表示で代表させる
          // (表示上は点4, 5を押している状態を反映すれば十分)
          code = brailleCodes.youonFu; // 代表として点4（拗音符）
        } else { // isYouHandakuon
          mode = 'YouHandakuon';
          // ★修正: 表示文字を「拗半濁音符」に設定
          char = '拗半濁音符';
          // 拗半濁音符は「点4 + 点6」の複合点字だが、ここでは代表として点4（拗音符）
          code = brailleCodes.youonFu; 
        }
        
        const braille = hexToBraille(code);
        setCurrentMode(mode);
        const displayData = { character: char, braille, dots: currentDots }; // charには「拗濁音符」などが入る

        onDisplayUpdate(displayData);
        setPendingData(displayData);
        return;
      } 


        else {
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