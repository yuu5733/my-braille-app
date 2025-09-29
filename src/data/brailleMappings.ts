import { hiraganaTable, hiraganaKigouTable, numberTable, alphabetTable } from './table';
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';
import type { BrailleMapping } from './types';

// export const brailleMappings: BrailleMapping[] = [
//   { character: 'あ', dots: [1] },
//   { character: 'い', dots: [1, 2] },
//   { character: 'う', dots: [1, 4] },
//   { character: 'え', dots: [1, 2, 4] },
//   { character: 'お', dots: [2, 4] },
//   { character: 'か', dots: [1, 6] },
//   // 拗音、数符
//   { character: 'きゃ', combo: [brailleCodes.youon_fu, [1, 4]] },
//   { character: '1', combo: [brailleCodes.su_fu, [1]] },
// ];

// スプレッド構文を使って二つのテーブルを結合する
// キーが重複した場合は後者が優先される
const combinedTable = {
  ...hiraganaTable,
  ...hiraganaKigouTable,
  // ...numberTable,
  // ...alphabetTable,
};

// hiraganaTableをもとにbrailleMappingsを生成
// オブジェクトをキーと値のペアの配列に変換する（Object.entries）
export const brailleMappings: BrailleMapping[] = Object.entries(combinedTable).map(
  ([character, hexCode]) => {
    return {
      character: character, // ひらがな
      dots: hexToDots(hexCode), // 点の配列
      braille: hexToBraille(hexCode), // Unicode点字文字
    };
  }
);

// brailleMappingsから逆引きのマッピングを作成
export const brailleToCharacterMap: { [key: string]: string } = {};
brailleMappings.forEach(mapping => {
  if (mapping.braille) {
    brailleToCharacterMap[mapping.braille] = mapping.character;
  }
});