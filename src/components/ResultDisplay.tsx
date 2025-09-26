import React from 'react';
import type { FC } from 'react';
import '../styles/resultDisplay.css';

interface ResultDisplayProps {
  text: string;
  brailleText: string;
  dots: number[];
}

const ResultDisplay: FC<ResultDisplayProps> = ({ text, brailleText, dots }) => {
  return (
    <div className="result-display">
      <div>
        {/* ひらがなと点字を一行に表示 */}
        <p>
          <span className="result-text">{text}</span>
          <span className="result-braille">{brailleText}</span>
        </p>
        {/* 数字データをその下に表示 */}
        <p className="result-dots">
          {dots.length > 0 ? dots.join(', ') : '...'}
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay