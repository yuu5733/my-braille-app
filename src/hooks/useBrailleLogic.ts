// 1. コアライブラリ
import { useEffect, useState } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode } from '../data/types'; 

// 3. サードパーティライブラリ (※ 無し)
import { useKeyboardListener } from './useKeyboardListener';

// 4. プロジェクト内のモジュール / エイリアスパス
import { getCurrentDots, dakuonFuKey } from '../utils/brailleConverter';
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

interface UseBrailleLogicProps {
  onOutput: (char: string) => void; // 確定した文字をアプリに追加する関数
  onDisplayUpdate: (data: BrailleData) => void; // 現在の押下状態を表示に反映する関数
  onModeChange: (newMode: InputMode) => void; // ModeDisplayを更新する関数
}

export function useBrailleLogic({ onOutput, onDisplayUpdate, onModeChange }: UseBrailleLogicProps) {
  // キーボードイベントの管理
  const pressedKeys = useKeyboardListener(); 
  
  // 状態管理
  const [currentMode, setCurrentMode] = useState<InputMode>('Kana');
  const [pendingData, setPendingData] = useState<BrailleData | null>(null);


  // ModeDisplayに渡すためのモードチェンジを親に伝播
  useEffect(() => {
    onModeChange(currentMode);
  }, [currentMode, onModeChange]);


  useEffect(() => {
    const currentDots = getCurrentDots(pressedKeys);
    const keys = Array.from(pressedKeys); 
    const isKeysReleased = pressedKeys.size === 0;

     // -----------------------------------------------------
    // A. キーが全て離された場合（文字確定のタイミング）
    // -----------------------------------------------------
  if (isKeysReleased) {
    // pendingData があれば確定し、クリアする
    if (pendingData && pendingData.character !== '濁音符' && pendingData.character !== '不明') {
      onOutput(pendingData.character);
    }
    
    // 確定後、すべての状態をクリア
    setPendingData(null); 
    onDisplayUpdate({ character: '', braille: '', dots: [] });
    onModeChange('Kana');
    
    // キーが離されたため、保留中のタイマーはキャンセル
    return;
  }

    // -----------------------------------------------------
    // B. キーが押されている場合（表示更新と待機データ生成）
    // -----------------------------------------------------

    // ★ NEW: 100ms後に実行するタイマーを設定
    const timer = setTimeout(() => {

      // 1. モード変更キーの判定（濁音符 'k' の単独押下）
      if (keys.length === 1 && keys[0] === dakuonFuKey) {
          // 濁音符単独入力の場合
          const dakuonBraille = hexToBraille(brailleCodes.dakuonFu); // dakuonFuを使用
          
          setCurrentMode('Dakuon');
          
          const displayData: BrailleData = { 
              character: '濁音符', 
              braille: dakuonBraille, // 0x10を変換した文字
              dots: currentDots 
          };
          
          onDisplayUpdate(displayData);
          setPendingData(displayData);
          return; 
      }
      
      // 2. 通常の点字入力判定 (モードが 'Kana' の状態)
      const characterData = getBrailleData(pressedKeys);

      if (characterData !== null) {
        // マッピングが見つかった場合（「い」など）
        onDisplayUpdate(characterData);
        setPendingData(characterData);
      } else {
        // マッピングが見つからなかった場合（不明な点字）
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

    }, 100); // 100ミリ秒後に上記のロジックを実行
    
    // クリーンアップ関数: pressedKeysが変化するたび（キーが押される/離されるたび）に、
    // 以前設定したタイマーをキャンセルする（デバウンスの核心）
    return () => {
      clearTimeout(timer);
    };
  }, [pressedKeys]);

  return { pressedKeys, currentMode };
}