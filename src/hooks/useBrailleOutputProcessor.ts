// 1. コアライブラリ
import { useCallback } from 'react';

// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス

// 5. 相対パスによるインポート
import { getConvertedCharacter } from '../utils/modeLogic'; 

// 6. スタイルシート / アセット


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

  // pendingData, currentMode, onOutput, setModeが変更された時のみ再生成
  const processOutput = useCallback(() => {
    if (!pendingData) return false;
    const confirmedCharacter = pendingData.character;
    
    // --- 1. モード維持の最優先チェック ---
    const isModeMaintained = 
        (currentMode === 'Dakuon' && confirmedCharacter === '濁音符') ||
        (currentMode === 'Handakuon' && confirmedCharacter === '半濁音符') ||
        (currentMode === 'Youon' && confirmedCharacter === '拗音符') ||
        (currentMode === 'YouDakuon' && confirmedCharacter === '拗濁音符') ||
        (currentMode === 'YouHandakuon' && confirmedCharacter === '拗半濁音符');

    if (isModeMaintained) {
        return true; // モードを維持
    }

    // --- 2. 待機モードの処理 ---
    const isWaitingMode = currentMode === 'Dakuon' || currentMode === 'Handakuon' ||
                        currentMode === 'Youon' || currentMode === 'YouDakuon' ||
                        currentMode === 'YouHandakuon';

    if (isWaitingMode) {
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
        let nextMode: InputMode | null = null;
        
        // 確定された文字がモード符であるかを判定し、次のモードを決定
        if (confirmedCharacter === '濁音符') {
            nextMode = 'Dakuon';
        } else if (confirmedCharacter === '半濁音符') {
            nextMode = 'Handakuon';
        } else if (confirmedCharacter === '拗音符') {
            nextMode = 'Youon';
        } else if (confirmedCharacter === '拗濁音符') {
            nextMode = 'YouDakuon';
        } else if (confirmedCharacter === '拗半濁音符') {
            nextMode = 'YouHandakuon';
        }

        if (nextMode !== null) {
            // モード符が入力された場合、待機モードへ移行
            setMode(nextMode);
            return false; // モードが変更されたことを示す
        }
        
        // モード符ではなく、清音または不明な点字の場合
        else if (confirmedCharacter !== '不明') {
            onOutput(confirmedCharacter); // 清音の確定
        }
    }

    return false; // モードは変更されなかった
  }, [pendingData, currentMode, onOutput, setMode]);

  return { processOutput };
}