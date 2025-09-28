/*
 * Braille data is adapted from https://github.com/uhyo/tenji
 * which is licensed under the MIT License.
 *
 * The MIT License
 *
 * Copyright (c) 2018 Uhyo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
//清音のテーブル
export const hiraganaTable: { [key: string]: number } = {
  あ: 0x01,
  い: 0x03,
  う: 0x09,
  え: 0x0b,
  お: 0x0a,
  か: 0x21,
  き: 0x23,
  く: 0x29,
  け: 0x2b,
  こ: 0x2a,
  さ: 0x31,
  し: 0x33,
  す: 0x39,
  せ: 0x3b,
  そ: 0x3a,
  た: 0x15,
  ち: 0x17,
  つ: 0x1d,
  て: 0x1f,
  と: 0x1e,
  な: 0x05,
  に: 0x07,
  ぬ: 0x0d,
  ね: 0x0f,
  の: 0x0e,
  は: 0x25,
  ひ: 0x27,
  ふ: 0x2d,
  へ: 0x2f,
  ほ: 0x2e,
  ま: 0x35,
  み: 0x37,
  む: 0x3d,
  め: 0x3f,
  も: 0x3e,
  や: 0x0c,
  ゆ: 0x2c,
  よ: 0x1c,
  ら: 0x11,
  り: 0x13,
  る: 0x19,
  れ: 0x1b,
  ろ: 0x1a,
  わ: 0x04,
  ゐ: 0x06,
  ゑ: 0x16,
  を: 0x14,
  ん: 0x34,
  っ: 0x02,
  ー: 0x12,
};
//濁音の一覧
export const dakuonList = "がぎぐげござじずぜぞだぢづでどばびぶべぼ";
//半濁音の一覧
export const handakuonList = "ぱぴぷぺぽ";

//拗音→メイン音変換テーブル
export const yoonTable: { [key: string]: string } = {
  き: "かくこけ",
  し: "さすそせ",
  ち: "たつとて",
  に: "なぬのね",
  ひ: "はふほへ",
  み: "まむもめ",
  り: "らるろれ",
  ぎ: "がぐごげ",
  じ: "ざずぞぜ",
  ぢ: "だづどで",
  び: "ばぶぼべ",
  ぴ: "ぱぷぽぺ"
};
//合拗音
export const goyoonTable: { [key: string]: string } = {
  う: "あいえお",
  く: "かきけこ",
  つ: "たちてと",
  ふ: "はひへほ",
  ぐ: "がぎげご",
  ゔ: "ばびべぼ"
};

//記号
export const kigouTable: { [key: string]: number[] } = {
  "?": [0x22],
  "!": [0x16],
  "『": [0x30, 0x24],
  "』": [0x24, 0x06],
  "%": [0x30, 0x0f],
  // アンパサンドは前後にスペースが必要
  "&": [0, 0x30, 0x2f, 0],
  "#": [0x30, 0x29],
  "*": [0x30, 0x21],
  ",": [0x20],
  ";": [0x60],
  ":": [0x12]
};

//数値
export const numberTable: number[] = [
  0x1a,
  0x01,
  0x03,
  0x09,
  0x19,
  0x11,
  0x0b,
  0x1b,
  0x13,
  0x0a
];
//アルファベット（aから）
export const alphabetTable: number[] = [
  0x01,
  0x03,
  0x09,
  0x19,
  0x11,
  0x0b,
  0x1b,
  0x13,
  0x0a,
  0x1a,
  0x05,
  0x07,
  0x0d,
  0x1d,
  0x15,
  0x0f,
  0x1f,
  0x17,
  0x0e,
  0x1e,
  0x25,
  0x27,
  0x3a,
  0x2d,
  0x3d,
  0x35
];
// アルファベットで使用可能な記号類
export const alphabetKigouTable = {
  "/": [0x38, 0x0c],
  ".": [0x32],
  "．": [0x32]
};