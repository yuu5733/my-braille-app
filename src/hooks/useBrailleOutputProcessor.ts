import type { BrailleData, InputMode } from '../data/types';
import { dakuonMap, handakuonMap } from '../data/table'; // 濁音マッピングテーブルをインポート

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
    
    // --- A-1. 濁音モード維持の最優先チェック ---
    // Dakuonキーを押して離したが、まだ次の入力がない場合
    if (currentMode === 'Dakuon' && confirmedCharacter === '濁音符') {
        // モードを維持するために何もせず、リセット処理もスキップ
        return true; // モードが維持されたことを示す
    }

    // --- B-1. 半濁音モード維持の最優先チェック
    // Handakuonキーを押して離したが、まだ次の入力がない場合
    if (currentMode === 'Handakuon' && confirmedCharacter === '半濁音符') {
      return true;
    }

    // --- A-2. 濁音待機モードの処理 ---
    if (currentMode === 'Dakuon') {
        if (confirmedCharacter !== '濁音符') {
            const dakuonChar = dakuonMap[confirmedCharacter];
            if (dakuonChar) {
                onOutput(dakuonChar); // 濁音化成功
            } else if (confirmedCharacter !== '不明') {
                onOutput(confirmedCharacter); // 濁音化失敗、清音を出力（設定による）
            }
        }
        // モードをリセット
        setMode('Kana');
        return false; // モードが変更されたことを示す
    } 

    // B-2. 半濁音待機モードの処理
    else if (currentMode === 'Handakuon') {
        if (confirmedCharacter !== '半濁音符') {
            const handakuonChar = handakuonMap[confirmedCharacter];
            if (handakuonChar) {
              onOutput(handakuonChar); // 半濁音化成功
            } else if (confirmedCharacter !== '不明') {
              onOutput(confirmedCharacter); // 半濁音化失敗、清音を出力
            }
        }
        setMode('Kana');
        return false;
    }

    // --- X. Kanaモードの処理 ---
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