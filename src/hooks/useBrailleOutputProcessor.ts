import type { BrailleData, InputMode } from '../data/types';
import { dakuonMap } from '../data/table'; // 濁音マッピングテーブルをインポート

/**
 * キー解放時に入力された文字を確定し、モードに基づいて変換・出力する
 * @param pendingData 安定した入力で表示されたBrailleData
 * @param currentMode 現在のロジックモード
 * @param onOutput 確定文字出力関数
 * @param onModeChange 外部モード変更関数
 * @param setCurrentMode 内部モードState更新関数
 * @returns { boolean } モードが維持されたかどうか
 */
export function useBrailleOutputProcessor(
  pendingData: BrailleData | null,
  currentMode: InputMode,
  onOutput: (char: string) => void,
  onModeChange: (newMode: InputMode) => void,
  setCurrentMode: (newMode: InputMode) => void,
) {
  // useEffect やカスタムフックではないが、ロジックをカプセル化するための関数として定義

  const processOutput = () => {
    if (!pendingData) return;
    const confirmedCharacter = pendingData.character;
    
    // --- A-1. 濁音モード維持の最優先チェック ---
    // Dakuonキーを押して離したが、次の入力がない場合
    if (currentMode === 'Dakuon' && confirmedCharacter === '濁音符') {
        // モードを維持するために何もせず、リセット処理もスキップ
        return true; // モードが維持されたことを示す
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
        onModeChange('Kana');
        setCurrentMode('Kana');
        return false; // モードが変更されたことを示す
    } 
    
    // --- A-3. Kanaモードの処理 ---
    else if (currentMode === 'Kana') {
        if (confirmedCharacter === '濁音符') {
            // Kanaモード中に濁音キーを離した場合 -> Dakuonモードへ移行
            onModeChange('Dakuon');
            setCurrentMode('Dakuon');
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