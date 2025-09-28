import { hiraganaTable } from './table';
import { hexToDots } from '../utils/hexToDots';
import { hexToBraille } from '../utils/hexToBraille';
import type { BrailleMapping } from './types';

export const brailleCodes = {
  // 濁音符　例）ぎ
  dakuon_fu: [5],
  // 半濁音符　例）ぴ
  handakuon_fu: [6],
  // 拗音符　例）きゃ
  youon_fu: [4],
  // 拗濁音符　例）ぎゃ
  youdakuon_fu: [4,5],
  // 拗半濁音符　例）ぴゃ
  youhandakuon_fu: [4,6],
  // 数符
  su_fu: [3, 4, 5, 6],
  // つなぎ符（数字にあ行、またはら行が続く時に使用する）
  tsunagi_fu: [3, 6],
  // 外字符
  gaiji_fu: [5, 6],
  // 大文字符
  ohmoji_fu: [6],
};

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

// hiraganaTableをもとにbrailleMappingsを生成（現在は清音のみ）
// オブジェクトをキーと値のペアの配列に変換する（Object.entries）
export const brailleMappings: BrailleMapping[] = Object.entries(hiraganaTable).map(
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