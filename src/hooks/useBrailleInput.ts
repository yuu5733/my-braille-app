// 1. コアライブラリ
// 2. 型定義 (Type Imports)
import type { BrailleData, InputMode } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { useKeyboardListener } from './useKeyboardListener';

// 5. 相対パスによるインポート

// 6. スタイルシート / アセット

// 指点字キーと点の番号のマッピング
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

// interface UseBrailleInputProps {
//   onConfirm: (data: BrailleData) => void; 
//   onModeChange: (newMode: InputMode) => void;
// }

/**
 * 押下状態の変更を監視し、点字変換ロジックを実行するカスタムフック
 * @returns pressedKeys: 現在押されている指点字キーのSet
 */
export function useBrailleInput() {
  // キーボードイベントの管理を useKeyboardListener に移譲
  const pressedKeys = useKeyboardListener(); 

  return {pressedKeys};
}