// 1. コアライブラリ (※ 無し)

// 2. 型定義 (Type Imports)
import type { BrailleMapping } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)
// 4. プロジェクト内のモジュール / エイリアスパス (※ 無し)
// 5. 相対パスによるインポート (※ 無し)

// 6. スタイルシート / アセット
import { brailleMappings } from '../data/brailleMappings';
import { brailleCodes } from '../data/table';

// キーと点字の点の対応マップ
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

// 点の番号 -> キーボードのキー への逆マッピング
const dotToKeyMap: { [key: number]: string } = {
    1: 'f', 2: 'd', 3: 's',
    4: 'j', 5: 'k', 6: 'l'
};

/** 濁音符 (0x10) の点5に対応するキー 'k' を取得 */
// const dokuonFuDots = hexToDots(brailleCodes.dakuonFu);
export const dakuonFuKey = dotToKeyMap[5]; 

/** 半濁音符 (0x20) の点6に対応するキー 'l' を取得 */
export const handakuonFuKey = dotToKeyMap[6]; 

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * 押されたキーのSetから対応する点字の文字を判定する
 * @param pressedKeys 押されているキーのSet
 * @returns 判定された文字 (見つからない場合はnull)
 */
export function getBrailleData(pressedKeys: Set<string>): BrailleMapping | null {
  // Setから点の配列に変換し、数字順にソートする
  const currentDots = Array.from(pressedKeys)
    .map(key => keyToDotMap[key])
    .sort((a, b) => a - b);

  const foundMapping = brailleMappings.find(
    (mapping: BrailleMapping) =>
      mapping.dots && arraysEqual(mapping.dots, currentDots)
  );

  return foundMapping ? foundMapping : null;
}

/**
 * 押されたキーのSetから、対応する指点字の点の番号（1-6）の配列を生成する
 * @param pressedKeys 押されているキーのSet
 * @returns ソートされた点の番号の配列
 */
export function getCurrentDots(pressedKeys: Set<string>): number[] {
  return Array.from(pressedKeys)
    .map(key => keyToDotMap[key])
    .filter((dot): dot is number => dot !== undefined) // 点に対応しないキーは除外
    .sort((a, b) => a - b);
}