import type { InputMode } from '../data/types';
import { dakuonMap, handakuonMap } from '../data/table';

/**
 * モードと清音文字に基づき、最終的な確定文字を返す
 * @param mode 現在の入力モード ('Dakuon', 'Handakuon', 'Kana'など)
 * @param character 清音の文字
 * @returns 変換後の文字
 */
export function getConvertedCharacter(mode: InputMode, character: string): string {
  if (character === '不明') return '不明';
    
  if (mode === 'Dakuon') {
    const dakuonChar = dakuonMap[character];
    return dakuonChar || character; // マッピングがなければ清音を返す
  } 
  
  if (mode === 'Handakuon') {
    const handakuonChar = handakuonMap[character];
    return handakuonChar || character; // マッピングがなければ清音を返す
  }
  
  // 'Kana'モードなどの場合はそのまま返す
  return character;
}

/**
 * モードキー単独入力時（k/lキー）のモード変更判定と表示データ作成
 * この関数は、モードキー単独押下時の表示データ生成ロジックをカプセル化します。
 * * useBrailleLogic内のモードキー判定ロジックをここに移植することで、
 * useBrailleLogicのコードをスリム化できます。
 */
// ... (このファイルには、useBrailleLogic内のモードキー判定ロジックも移植可能)