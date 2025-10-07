import { createContext, useContext } from 'react';
import type { BrailleData, InputMode } from '../data/types';
import type { Dispatch, SetStateAction } from 'react';

// Context が提供する値の型を定義
export interface BrailleContextType {
  currentMode: InputMode;
  setCurrentMode: Dispatch<SetStateAction<InputMode>>;
  
  // const [value, setValue] = useState<T>(initialValue);
  // setValue の型が、 React.Dispatch<React.SetStateAction<T>>
  // voidなどにしてしまうと、Context 経由で State 更新ができない
  pendingData: BrailleData | null;
  setPendingData: Dispatch<SetStateAction<BrailleData | null>>;
  
  onOutput: (char: string) => void;             // 確定文字の出力
  onDisplayUpdate: (data: BrailleData) => void; // 表示の更新

  character: string;      // ResultDisplay用
  braille: string;        // ResultDisplay用
  dots: number[];         // ResultDisplay用
  outputString: string;   // 確定文字列用
}

// 初期値を null に設定（Provider の使用を必須とする）
export const BrailleContext = createContext<BrailleContextType | null>(null);

// カスタムフックとしてラップし、使いやすくする
export const useBrailleContext = () => {
  const context = useContext(BrailleContext);
  if (!context) {
    throw new Error('useBrailleContext は BrailleProvider の内部でのみ使用可能です');
  }
  return context;
};