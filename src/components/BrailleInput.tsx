import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import FingerButton from './FingerButton';
import { brailleMappings, brailleCodes } from '../data/brailleMappings';
import type { FingerStates, BrailleCode } from '../data/types';
import '../styles/brailleInput.css';

// インデックスシグネチャ（キーが文字列型で、その値が数値型であるオブジェクト）
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

const BrailleInput: FC = () => {
  // const [fingerStates, setFingerStates] = useState<FingerStates>({
  //   leftIndex: false, leftMiddle: false, leftRing: false,
  //   rightIndex: false, rightMiddle: false, rightRing: false
  // });
  // const [lastCode, setLastCode] = useState<BrailleCode | null>(null);
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());

 useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (keyToDotMap[event.key]) {
      setPressedKeys(prev => new Set(prev).add(event.key));
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (keyToDotMap[event.key]) {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.key);
        return newSet;
      });
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
        <FingerButton id="leftRing" isPressed={pressedKeys.has('s')} dot={3} />
        <FingerButton id="leftMiddle" isPressed={pressedKeys.has('d')} dot={2} />
        <FingerButton id="leftIndex" isPressed={pressedKeys.has('f')} dot={1} />
      </div>
      <div className="finger-group">
        <FingerButton id="rightIndex" isPressed={pressedKeys.has('j')} dot={4} />
        <FingerButton id="rightMiddle" isPressed={pressedKeys.has('k')} dot={5} />
        <FingerButton id="rightRing" isPressed={pressedKeys.has('l')} dot={6} />
      </div>
    </div>
  );
};

export default BrailleInput;