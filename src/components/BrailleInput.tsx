import React, { useState, useEffect } from 'react';
import FingerButton from './FingerButton';
import { brailleMappings, brailleCodes } from '../data/brailleMappings';
import type { FingerStates, BrailleCode } from '../data/types';
import '../styles/brailleInput.css';

// インデックスシグネチャ（キーが文字列型で、その値が数値型であるオブジェクト）
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

const BrailleInput: React.FC = () => {
  const [fingerStates, setFingerStates] = useState<FingerStates>({
    leftIndex: false, leftMiddle: false, leftRing: false,
    rightIndex: false, rightMiddle: false, rightRing: false
  });
  const [lastCode, setLastCode] = useState<BrailleCode | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const dot = keyToDotMap[event.key];
      if (dot) {
        setFingerStates(prev => ({ ...prev, [event.key]: true }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const dot = keyToDotMap[event.key];
      if (dot) {
        // キーが離された瞬間の処理
        // TODO: ここに点字の判定ロジックを追加
        setFingerStates(prev => ({ ...prev, [event.key]: false }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="braille-input-container">
      {/* 左右の指のボタン */}
      <div className="finger-group">
        {/* <FingerButton id="leftIndex" isPressed={fingerStates.leftIndex} />
        <FingerButton id="leftMiddle" isPressed={fingerStates.leftMiddle} />
        <FingerButton id="leftRing" isPressed={fingerStates.leftRing} /> */}
      </div>
      <div className="finger-group">
        {/* <FingerButton id="rightIndex" isPressed={fingerStates.rightIndex} />
        <FingerButton id="rightMiddle" isPressed={fingerStates.rightMiddle} />
        <FingerButton id="rightRing" isPressed={fingerStates.rightRing} /> */}
      </div>
    </div>
  );
};

export default BrailleInput;