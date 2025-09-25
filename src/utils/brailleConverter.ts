import { brailleMappings } from '../data/brailleMappings';
import type { BrailleMapping } from '../data/types';

// キーと点字の点の対応マップ
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

/**
 * 押されたキーのSetから対応する点字の文字を判定する
 * @param pressedKeys 押されているキーのSet
 * @returns 判定された文字 (見つからない場合はnull)
 */
export function getBrailleCharacter(pressedKeys: Set<string>): string | null {
  // Setから点の配列に変換し、数字順にソートする
  const currentDots = Array.from(pressedKeys)
    .map(key => keyToDotMap[key])
    .sort((a, b) => a - b);

  // マッピングデータと照合する（オブジェクトでの比較はできないので、JSONで比べる）
  const foundMapping = brailleMappings.find(
    (mapping: BrailleMapping) =>
      JSON.stringify(mapping.dots) === JSON.stringify(currentDots)
  );

  return foundMapping ? foundMapping.character : null;
}