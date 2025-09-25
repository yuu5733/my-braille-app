import React from 'react';
import type { FC } from 'react';
import '../styles/resultDisplay.css';

interface ResultDisplayProps {
  text: string;
}

const ResultDisplay: FC<ResultDisplayProps> = ({ text }) => {
  return (
    <div className="result-display">
      <p>{text}</p>
    </div>
  );
};

export default ResultDisplay