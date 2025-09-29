// 1. コアライブラリ (※ 無し)

// 2. 型定義 (Type Imports)
import type { BrailleMapping } from './types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';

// 5. 相対パスによるインポート (※ 無し)

// 6. スタイルシート / アセット
import { hiraganaTable, hiraganaKigouTable, numberTable, alphabetTable } from './table';

// ----------------------------------------------------------------------
// 前置符のキーとモードのマッピングの定義
// ----------------------------------------------------------------------
// 濁音符（点5）
export const dakuonFuKey = 'k';

// 半濁音符（点6）
export const handakuonFuKey = 'l'; 

// 拗音符（点4）
export const youonFuKey = 'j';


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