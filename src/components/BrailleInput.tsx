// 1. コアライブラリ
import React from 'react';

// 2. 型定義 (Type Imports)
import type { FC } from 'react';
import type { BrailleData } from '../data/types';

// 3. サードパーティライブラリ (※ 無し)

// 4. プロジェクト内のモジュール / エイリアスパス
import { useBrailleInput } from '../hooks/useBrailleInput'; 

// 5. 相対パスによるインポート
import FingerButton from './FingerButton';

// 6. スタイルシート / アセット
import '../styles/brailleInput.css';

interface BrailleInputProps {
  onConfirm: (data: BrailleData) => void;
}

const BrailleInput: FC<BrailleInputProps> = ({ onConfirm }) => {
  const { pressedKeys } = useBrailleInput({ onConfirm }); 

  return (
    <div className="braille-input-container">
      {/* 左の指のボタン */}
      <div className="finger-group">
        <FingerButton id="leftRing" isPressed={pressedKeys.has('s')} dot={3} />
        <FingerButton id="leftMiddle" isPressed={pressedKeys.has('d')} dot={2} />
        <FingerButton id="leftIndex" isPressed={pressedKeys.has('f')} dot={1} />
      </div>
      {/* 右の指のボタン */}
      <div className="finger-group">
        <FingerButton id="rightIndex" isPressed={pressedKeys.has('j')} dot={4} />
        <FingerButton id="rightMiddle" isPressed={pressedKeys.has('k')} dot={5} />
        <FingerButton id="rightRing" isPressed={pressedKeys.has('l')} dot={6} />
      </div>
    </div>
  );
};

export default BrailleInput;