export type BrailleCode = number[];

export type FingerStates = {
  leftIndex: boolean;
  leftMiddle: boolean;
  leftRing: boolean;
  rightIndex: boolean;
  rightMiddle: boolean;
  rightRing: boolean;
};

export type BrailleMapping = {
  character: string;
  dots?: BrailleCode;
  combo?: [BrailleCode, BrailleCode];
  braille?: string;
};