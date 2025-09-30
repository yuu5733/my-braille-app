// 1. コアライブラリ
import { useEffect } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { useKeyboardListener } from './useKeyboardListener';

// 5. 相対パスによるインポート
import { getBrailleData, getCurrentDots } from '../utils/brailleConverter';
import { dotsToHex } from '../utils/dotsToHex';
import { hexToBraille } from '../utils/hexToBraille';

// 6. スタイルシート / アセット
import { dakuonFuKey } from '../data/brailleMappings';


// 指点字キーと点の番号のマッピング
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

interface UseBrailleInputProps {
  onConfirm: (data: BrailleData) => void; 
  onModeChange: (newMode: InputMode) => void;
}

/**
 * 押下状態の変更を監視し、点字変換ロジックを実行するカスタムフック
 * @returns pressedKeys: 現在押されている指点字キーのSet
 */
export function useBrailleInput({ onConfirm, onModeChange }: UseBrailleInputProps) {
  // キーボードイベントの管理を useKeyboardListener に移譲
  const pressedKeys = useKeyboardListener(); 

  // 押されたキーの変更を監視して文字を判定
  useEffect(() => {
    const currentDots = getCurrentDots(pressedKeys); // 押されている点を常に取得
    const keys = Array.from(pressedKeys); 


    // -----------------------------------------------------
    // 1. 【新規】濁音符・半濁音符の単独入力判定
    // -----------------------------------------------------
    if (keys.length === 1) {
      if (keys[0] === dakuonFuKey) {
        // 濁音符（kキー）単独の場合
        onModeChange('Dakuon');
        onConfirm({ character: '濁音符', braille: '・', dots: currentDots });
        return; 
      }
      // 他のモード変更キー（例：lキーで半濁音）は必要に応じて追加
    }
    
    // 単独の濁音符・半濁音符が押されていない場合は、モードをKanaに戻す（重要）
    // ただし、待機モード中に次のキーが押された場合の処理は後で実装
    onModeChange('Kana');

    // -----------------------------------------------------
    // 2. 通常の点字入力判定ロジック (以前のロジックを継続)
    // -----------------------------------------------------
    const characterData = getBrailleData(pressedKeys);

    if (characterData !== null) {
      onConfirm(characterData);
    } else {
      // ... (不明な点の表示ロジックは省略) ...
      let characterText = '';
      let brailleText = '';
      
      if (currentDots.length > 0) {
        const hexCode = dotsToHex(currentDots);
        brailleText = hexToBraille(hexCode); 
        characterText = '不明';
      }
      
      onConfirm({ 
        character: characterText, 
        braille: brailleText, 
        dots: currentDots 
      });
    }
  }, [pressedKeys, onConfirm, onModeChange]);

  return {
    pressedKeys,
    keyToDotMap,
  };
}