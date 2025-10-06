import { useState, useEffect } from 'react';
import type { InputMode } from '../data/types';
import { dakuonFuKey, handakuonFuKey } from '../data/brailleMappings';

// InputModeのStateと、それを更新するロジックを提供する
export function useBrailleModeManager(
  stabilizedKeys: Set<string> | null,
  onModeChange: (newMode: InputMode) => void
) {
  const [currentMode, setCurrentMode] = useState<InputMode>('Kana');

  useEffect(() => {
    if (!stabilizedKeys) return;
    
    const keys = Array.from(stabilizedKeys);

    // 1. モード変更キーの判定（kキー or lキー単独押下）
    if (keys.length === 1) {
      if (keys[0] === dakuonFuKey) {
        // 濁音符（kキー）単独の場合
        setCurrentMode('Dakuon');
        onModeChange('Dakuon'); // 外部表示を更新
      } else if (keys[0] === handakuonFuKey) {
        // 半濁音符（lキー）単独の場合
        setCurrentMode('Handakuon');
        onModeChange('Handakuon'); // 外部表示を更新
      }
      // その他のモード変更キーもここに追加
    }
    // ここでは、モード変更キー以外の入力があった場合は特に何もせず、
    // currentModeを維持する（次の文字確定フェーズで処理される）

  }, [stabilizedKeys]); // 安定したキー入力があった場合にのみ実行

  // 内部Stateと更新関数を公開
  return { currentMode, setCurrentMode };
}