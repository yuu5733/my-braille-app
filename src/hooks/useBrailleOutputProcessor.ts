import type { BrailleData, InputMode } from '../data/types';
import { getConvertedCharacter } from '../utils/modeLogic'; 
/**
 * キー解放時に入力された文字を確定し、モードに基づいて変換・出力する
 * @param pendingData 安定した入力で表示されたBrailleData
 * @param currentMode 現在のロジックモード
 * @param onOutput 確定文字出力関数
 * @param setMode 内部モードState更新関数
 * @returns { boolean } モードが維持されたかどうか
 */
export function useBrailleOutputProcessor(
  pendingData: BrailleData | null,
  currentMode: InputMode,
  onOutput: (char: string) => void,
  setMode: (newMode: InputMode) => void,
) {
  // useEffect やカスタムフックではないが、ロジックをカプセル化するための関数として定義

  const processOutput = () => {
    if (!pendingData) return false;
    const confirmedCharacter = pendingData.character;
    
    // --- 1. モード維持の最優先チェック ---
    const isModeKeyOnly = 
        (currentMode === 'Dakuon' && confirmedCharacter === '濁音符') ||
        (currentMode === 'Handakuon' && confirmedCharacter === '半濁音符');

    if (isModeKeyOnly) {
        return true; // モードを維持
    }

    // --- 2. 待機モードの処理 ---
    if (currentMode === 'Dakuon' || currentMode === 'Handakuon') {
        // モード符自体ではない確定文字が入力された場合
        if (confirmedCharacter !== '濁音符' && confirmedCharacter !== '半濁音符') {
            
            // 変換ロジックはユーティリティ関数に一任
            const convertedChar = getConvertedCharacter(currentMode, confirmedCharacter);
            
            if (convertedChar !== '不明') {
                onOutput(convertedChar);
            }
        }
        // モードをリセット
        setMode('Kana');
        return false; // モードが変更されたことを示す
    } 

    // --- 3. Kanaモードの処理 ---
    else if (currentMode === 'Kana') {
        if (confirmedCharacter === '濁音符') {
            // Kanaモード中に濁音キーを離した場合 -> Dakuonモードへ移行
            setMode('Dakuon');
            return false; // モードが変更されたことを示す
        } 
        // 半濁音待機への移行もここに追加
        // ...
        else if (confirmedCharacter !== '不明') {
            onOutput(confirmedCharacter); // 清音の確定
        }
    }
    return false; // モードは変更されなかった
  };

  return { processOutput };
}