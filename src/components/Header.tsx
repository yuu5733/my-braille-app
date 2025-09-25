import React, { useState } from 'react';
import '../styles/header.css';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  // ログイン処理やスコア更新のロジックをここに書きます
  const handleLogin = () => {
    // ログイン処理...
    setIsLoggedIn(true);
  };

  return (
    <header className="header">
      <div>
        {isLoggedIn ? (
          <span>最高記録: {bestScore}</span>
        ) : (
          <button onClick={handleLogin}>ログイン</button>
        )}
      </div>
      {/* 他の設定ボタンなどをここに追加 */}
    </header>
  );
};

export default Header;