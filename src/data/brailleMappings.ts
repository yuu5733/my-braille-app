import { hiraganaTable } from './table';
import { hexToDots } from '../utils/hexToDots';
import type { BrailleMapping } from './types';

export const brailleCodes = {
  youon_fu: [4, 6],
  su_fu: [3, 4, 5, 6],
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

export const brailleMappings: BrailleMapping[] = Object.entries(hiraganaTable).map(
  ([character, hexCode]) => {
    return {
      character: character,
      dots: hexToDots(hexCode),
    };
  }
);