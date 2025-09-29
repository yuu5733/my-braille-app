export type BrailleCode = number[];

export type FingerStates = {
  leftIndex: boolean;
  leftMiddle: boolean;
  leftRing: boolean;
  rightIndex: boolean;
  rightMiddle: boolean;
  rightRing: boolean;
};

export type BrailleData = {
  character: string;
  braille: string;
  dots: number[];
};

export type BrailleMapping = {
  character: string;
  dots: BrailleCode;
  braille: string;
  combo?: [BrailleCode, BrailleCode];
};

export type InputMode = 
  | 'Kana'       // 基本のがな入力モード
  | 'Suuji'      // 数字モード
  | 'Alphabet'   // 外来語符 (英字モード)
  | 'Dakuon'     // 濁音符待機モード
  | 'Handakuon'  // 半濁音符待機モード
  | 'Youon';     // 半濁音符待機モード