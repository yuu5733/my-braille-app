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
  // キーボードイベントの管理
  const pressedKeys = useKeyboardListener(); 
  
  // 状態管理
  const [currentMode, setCurrentMode] = useState<InputMode>('Kana');
  const [pendingData, setPendingData] = useState<BrailleData | null>(null);


  // ModeDisplayに渡すためのモードチェンジを親に伝播
  // useEffect(() => {
  //   onModeChange(currentMode);
  // }, [currentMode, onModeChange]);


  useEffect(() => {
    const currentDots = getCurrentDots(pressedKeys);
    const keys = Array.from(pressedKeys); 
    const isKeysReleased = pressedKeys.size === 0;

     // -----------------------------------------------------
    // A. キーが全て離された場合（文字確定のタイミング）
    // -----------------------------------------------------
  if (isKeysReleased) {
    if (pendingData) {
      const confirmedCharacter = pendingData.character;

      // --------------------------------------------------
      // 濁音符単独入力直後の解放かどうか
      // --------------------------------------------------
      if (currentMode === 'Dakuon' && confirmedCharacter === '濁音符') {
          // Dakuonキーを押して離したが、次の入力がない場合（待機モード継続）
          // 何もせず、StateもModeもリセットしないことで、モードを維持する！
          // Dakuonモードに設定されているため、次の入力が来たら1.の処理に入る
          setPendingData(null); // 表示はクリア
          onDisplayUpdate({ character: '', braille: '', dots: [] });
          return; // モードをリセットせずに終了
      }

      // 1. 濁音待機モードの場合の処理
      if (currentMode === 'Dakuon') {
          // 濁音符自体は文字ではないので、濁音符が待機データに入っていた場合は確定処理をスキップ
          if (confirmedCharacter === '濁音符') {
              // 濁音符単独で入力が終わった場合、濁音化はせずモードをKanaに戻すだけ
              // 確定文字は出力しない
          } else {
              // 清音の点字が検出された場合（例: 'か'）
              const dakuonChar = dakuonMap[confirmedCharacter];
          
              if (dakuonChar) {
                  // 濁音化成功: 'が' を出力
                  onOutput(dakuonChar);
              } else if (confirmedCharacter !== '不明') {
                  // 濁音化失敗: 濁音化できない文字の場合、清音をそのまま出力する（例：濁音符の後に'あ'）
                  // onOutput(confirmedCharacter);
              }
          }
          // 濁音処理を終えたら、必ずモードをKanaに戻す（内部・外部両方）
          onModeChange('Kana');
          setCurrentMode('Kana');

      } else if (currentMode === 'Kana') {
          // 2. 通常のKanaモードの場合の清音の確定処理
          if (confirmedCharacter === '濁音符') {
            onModeChange('Dakuon');
            setCurrentMode('Dakuon');
          } else if (confirmedCharacter === '不明') {

          } else {
            onOutput(confirmedCharacter); 
          }
          // Kanaモードの場合は、モード切り替えは不要
      }
    }

    // 確定後、すべての状態をクリア
    setPendingData(null); 
    onDisplayUpdate({ character: '', braille: '', dots: [] });
    //onModeChange('Kana');
    
    // キーが離されたため、保留中のタイマーはキャンセル
    return;
  }

    // -----------------------------------------------------
    // B. キーが押されている場合（表示更新と待機データ生成）
    // -----------------------------------------------------

    // 100ms後に実行するタイマーを設定
    const timer = setTimeout(() => {

      // 1. モード変更キーの判定（濁音符 'k' の単独押下）
      if (keys.length === 1 && keys[0] === dakuonFuKey) {
          // 濁音符単独入力の場合
          const dakuonBraille = hexToBraille(brailleCodes.dakuonFu); // dakuonFuを使用
          
          // 内部Stateと外部Propの両方を更新
          setCurrentMode('Dakuon');
          onModeChange('Dakuon'); 
          
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
  }, [pressedKeys, onOutput, onDisplayUpdate, onModeChange, currentMode, setCurrentMode, pendingData]);

  return { pressedKeys, currentMode };
}