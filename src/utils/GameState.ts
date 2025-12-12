export interface GameState {
    balance: number;
    betAmount: number;
    isSpinning: boolean;
    lastWin: number;
  }
  
  export interface SymbolType {
    id: string;
    emoji: string;
    value: number;
    payout: { [key: number]: number }; // symbol count -> multiplier
  }
  
  export const SYMBOLS: SymbolType[] = [
    { id: 'cherry', emoji: '🍒', value: 1, payout: { 3: 10 } },
    { id: 'lemon', emoji: '🍋', value: 2, payout: { 3: 5 } },
    { id: 'orange', emoji: '🍊', value: 3, payout: { 3: 8 } },
    { id: 'bell', emoji: '🔔', value: 4, payout: { 3: 20 } },
    { id: 'star', emoji: '⭐', value: 5, payout: { 3: 50 } },
    { id: 'seven', emoji: '7️⃣', value: 6, payout: { 3: 100 } },
  ];