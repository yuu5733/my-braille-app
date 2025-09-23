import React from 'react';
import './fingerButton.css'; // ボタンのスタイルシートをインポート

interface FingerButtonProps {
  id: string; // ボタンの識別子（例: 'leftIndex'）
  isPressed: boolean; // ボタンが押されているかどうか
}

const FingerButton: React.FC<FingerButtonProps> = ({ id, isPressed }) => {
  return (
    <button
      id={id}
      type="button"
      className={`finger-button ${isPressed ? 'pressed' : ''}`}
      aria-pressed={isPressed}
    >
      {id}
    </button>
  );
};

export default FingerButton;