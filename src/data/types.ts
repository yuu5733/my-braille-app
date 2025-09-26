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