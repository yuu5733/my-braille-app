import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import FingerButton from './FingerButton';
import { brailleMappings, brailleCodes } from '../data/brailleMappings';
import type { FingerStates, BrailleCode } from '../data/types';
import { getBrailleCharacter } from '../utils/brailleConverter';
import '../styles/brailleInput.css';

interface BrailleInputProps {
  onCharacterConfirm: (char: string) => void;
}

// インデックスシグネチャ（キーが文字列型で、その値が数値型であるオブジェクト）
const keyToDotMap: { [key: string]: number } = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6
};

const BrailleInput: FC<BrailleInputProps> = ({ onCharacterConfirm }) => {
  // const [fingerStates, setFingerStates] = useState<FingerStates>({
  //   leftIndex: false, leftMiddle: false, leftRing: false,
  //   rightIndex: false, rightMiddle: false, rightRing: false
  // });

  // 初期値として、空の Set オブジェクト（String型）を設定。String型の配列にするより便利
  // 重複を許容しないのと、要素の存在チェック (.has()) や削除 (.delete()) が簡単にできるため
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());

  // 数符などのために、最後に入力された点字コードを保存する
  // const [lastCode, setLastCode] = useState<BrailleCode | null>(null);

 useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // 指点字として設定しているキーが押されたとき
    if (keyToDotMap[event.key] && !pressedKeys.has(event.key)) {
      // 新しいSetインスタンスを作成してStateを更新。配列の時に[...prev]として新しい配列を作成するのと同様
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
    // クリーンアップ関数でイベントリスナーを削除（アンマウント時）
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };
}, [pressedKeys]); // pressedKeysが変わるたびに再登録される

  // pressedKeys の変更を監視して文字を判定
  useEffect(() => {
    // 押されているキーがなくなった場合（空のSet）は何も表示しない
    if (pressedKeys.size === 0) {
      onCharacterConfirm('');
      return;
    }
    
    // ユーティリティ関数を呼び出して文字を判定
    const character = getBrailleCharacter(pressedKeys);
    if (character) {
      onCharacterConfirm(character);
    }
  }, [pressedKeys, onCharacterConfirm]);

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