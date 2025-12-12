import { useState, useCallback, useEffect, useRef } from 'react';
import { Application, extend } from '@pixi/react';
import { Container, Text } from 'pixi.js';
import { Reel } from './Reel';
import type { SymbolType } from '../utils/GameState';
import { calculateWin } from '../utils/PaylineCalculator';
import { useSounds } from '../hooks/useSounds';


interface SlotMachineProps {
    onSpinComplete: (winAmount: number) => void;
    isSpinning: boolean;
    betAmount: number;
}

const REEL_COUNT = 3;
const REEL_SPACING = 120;
const START_X = 180;

// Extend pixi-react with Container component
extend({ Container, Text });

export default function SlotMachine({ onSpinComplete, isSpinning, betAmount }: SlotMachineProps) {
  const [reelResults, setReelResults] = useState<SymbolType[][]>([]);
  const [completedReels, setCompletedReels] = useState(0);
  const hasProcessedWin = useRef(false);
  const { playSound } = useSounds();

  // Play spin start sound when spinning begins
  useEffect(() => {
    if (isSpinning) {
      playSound('spin-start');
    }
  }, [isSpinning, playSound]);

  // Reset win processing state when spinning starts
  useEffect(() => {
    if (isSpinning) {
      hasProcessedWin.current = false;
    }
  }, [isSpinning]);

  // Process win after all reels complete and results are ready
  useEffect(() => {
    if (completedReels === REEL_COUNT && reelResults.length === REEL_COUNT && !hasProcessedWin.current) {
      hasProcessedWin.current = true;
      const winAmount = calculateWin(reelResults, betAmount);
      
      console.log('=== WIN CALCULATION DEBUG ===');
      console.log('Final reel results (3x3 grid):');
      reelResults.forEach((reel, i) => {
        console.log(`Reel ${i}: [${reel.map(s => s.emoji).join(' ')}] (${reel.map(s => s.id).join(', ')})`);
      });
      console.log('Row analysis:');
      for (let row = 0; row < 3; row++) {
        const rowSymbols = reelResults.map(reel => reel[row]);
        const rowEmojis = rowSymbols.map(s => s.emoji).join(' ');
        const rowIds = rowSymbols.map(s => s.id);
        const isWin = rowIds[0] === rowIds[1] && rowIds[1] === rowIds[2];
        console.log(`Row ${row + 1} (${row === 0 ? 'TOP' : row === 1 ? 'MIDDLE' : 'BOTTOM'}): [${rowEmojis}] - ${isWin ? 'WIN!' : 'No win'}`);
      }
      console.log('Total win amount:', winAmount);
      
      // Play win or lose sound
      if (winAmount > 0) {
        console.log('🎉 WIN DETECTED! Playing win sound');
        playSound('win');
      } else {
        console.log('❌ No win detected');
      }
      
      onSpinComplete(winAmount);
    }
  }, [completedReels, reelResults, betAmount, onSpinComplete, playSound]);

  const handleReelComplete = useCallback((allSymbols: SymbolType[], reelIndex: number) => {
    setReelResults(prev => {
      const newResults = [...prev];
      newResults[reelIndex] = allSymbols;
      return newResults;
    });

    setCompletedReels(prev => prev + 1);
  }, []);

  // Reset state when spin completes (after win is processed)
  useEffect(() => {
    if (completedReels === REEL_COUNT && hasProcessedWin.current) {
      const timer = setTimeout(() => {
        setCompletedReels(0);
        setReelResults([]);
      }, 1000); // Give time for win display

      return () => clearTimeout(timer);
    }
  }, [completedReels]);

  return (
    <div className="slot-machine">
      <Application
        width={600}
        height={300}
        backgroundColor={0x1a1a2e}
        antialias={true}
      >
        <pixiContainer>
          {/* Background frame */}
          <pixiContainer x={50} y={50}>
            {/* Slot machine frame */}
            <pixiContainer x={0} y={0} width={500} height={200}>
            </pixiContainer>
          </pixiContainer>
          
          {/* Reels - called as components, they render themselves */}
          <Reel x={START_X} y={30} isSpinning={isSpinning} onSpinComplete={(all) => handleReelComplete(all, 0)} delay={0} />
          <Reel x={START_X + REEL_SPACING} y={30} isSpinning={isSpinning} onSpinComplete={(all) => handleReelComplete(all, 1)} delay={1} />
          <Reel x={START_X + REEL_SPACING * 2} y={30} isSpinning={isSpinning} onSpinComplete={(all) => handleReelComplete(all, 2)} delay={2} />
        </pixiContainer>
      </Application>
    </div>
  );
}