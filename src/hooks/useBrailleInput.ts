// 1. コアライブラリ
import { useEffect } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { useKeyboardListener } from './useKeyboardListener';

// 5. 相対パスによるインポート
import { getBrailleData, getCurrentDots } from '../utils/brailleConverter';
import { dotsToHex } from '../utils/dotsToHex';
import { hexToBraille } from '../utils/hexToBraille';


// 指点字キーと点の番号のマッピング
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

interface UseBrailleInputProps {
  onConfirm: (data: BrailleData) => void; 
}

/**
 * 押下状態の変更を監視し、点字変換ロジックを実行するカスタムフック
 * @returns pressedKeys: 現在押されている指点字キーのSet
 */
export function useBrailleInput({ onConfirm }: UseBrailleInputProps) {
  // キーボードイベントの管理を useKeyboardListener に移譲
  const pressedKeys = useKeyboardListener(); 

  // 押されたキーの変更を監視して文字を判定
  useEffect(() => {
    const currentDots = getCurrentDots(pressedKeys); // 押されている点を常に取得
    const characterData = getBrailleData(pressedKeys);

    if (characterData !== null) {
      // マッピングが見つかった場合
      onConfirm(characterData);
    } else {
      // マッピングが見つからなかった場合: 現在の押下状態を表示
      let characterText = '';
      let brailleText = '';
      
      if (currentDots.length > 0) {
        const hexCode = dotsToHex(currentDots); // 押されている点に対応する16進コードを生成
        brailleText = hexToBraille(hexCode); // 押されている点に対応する点字文字を生成
        characterText = '不明';
      }
      
      // 墨字は「不明」か空、点字は該当する点字か空、点の配列は現在押されているものを渡す
      onConfirm({ 
        character: characterText, 
        braille: brailleText, 
        dots: currentDots 
      });
    }
  }, [pressedKeys, onConfirm]);

  return {
    pressedKeys,
    keyToDotMap,
  };
}