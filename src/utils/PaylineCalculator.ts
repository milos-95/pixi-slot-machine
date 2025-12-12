import type { SymbolType } from './GameState';
import { SYMBOLS } from './GameState';

export const calculateWin = (
  reelResults: SymbolType[][], // 3x3 grid
  betAmount: number
): number => {
  if (reelResults.length !== 3 || !reelResults.every(reel => reel.length === 3)) return 0;
  
  let totalWin = 0;
  
  // Check all three horizontal paylines
  for (let row = 0; row < 3; row++) {
    const rowSymbols = [
      reelResults[0][row],
      reelResults[1][row],
      reelResults[2][row]
    ];
    
    // Check for 3 of a kind in this row
    if (rowSymbols[0].id === rowSymbols[1].id && rowSymbols[1].id === rowSymbols[2].id) {
      totalWin += rowSymbols[0].payout[3] * betAmount;
    }
  }
  
  return totalWin;
};

export const getRandomSymbol = (): SymbolType => {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
};