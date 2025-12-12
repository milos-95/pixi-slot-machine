import { useState, useEffect, useRef } from 'react';
import { SymbolComponent } from './Symbol';
import type { SymbolType } from '../utils/GameState';
import { getRandomSymbol } from '../utils/PaylineCalculator';

interface ReelProps {
  x: number;
  y: number;
  isSpinning: boolean;
  onSpinComplete: (allSymbols: SymbolType[]) => void;
  delay?: number;
}

const SYMBOL_HEIGHT = 80;
const TOTAL_SYMBOLS = 6;

export const Reel = ({ x, y, isSpinning, onSpinComplete, delay = 0 }: ReelProps) => {
  const [symbols, setSymbols] = useState<SymbolType[]>(() => 
    Array(TOTAL_SYMBOLS).fill(null).map(() => getRandomSymbol())
  );
  const [scrollOffset, setScrollOffset] = useState(40);
  const [hasCompletedSpin, setHasCompletedSpin] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  // Reset completion state when spinning starts
  useEffect(() => {
    if (isSpinning) {
      setHasCompletedSpin(false);
    }
  }, [isSpinning]);

  useEffect(() => {
    if (isSpinning && !hasCompletedSpin) {
      const startSpin = () => {
        startTimeRef.current = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - (startTimeRef.current || 0);
          const duration = 2000 + delay * 200;
          
          if (elapsed < duration) {
            const progress = elapsed / duration;
            const speed = progress < 0.7 ? 15 : 15 * (1 - (progress - 0.7) / 0.3);
            setScrollOffset(prev => prev + speed);
            
            animationRef.current = requestAnimationFrame(animate);
          } else {
            // Animation complete
            const finalSymbol = getRandomSymbol();
            
            // Calculate final position to show the winning symbol in the middle
            const targetMiddleY = SYMBOL_HEIGHT * 1.5; // Middle of visible area (120px)
            const currentMiddleIndex = Math.floor((scrollOffset + targetMiddleY) / SYMBOL_HEIGHT) % TOTAL_SYMBOLS;
            
            // Create the updated symbols array with the final symbol
            const updatedSymbols = [...symbols];
            updatedSymbols[currentMiddleIndex] = finalSymbol;
            
            setSymbols(updatedSymbols);
            
            // Snap to final position
            const finalOffset = currentMiddleIndex * SYMBOL_HEIGHT - targetMiddleY + SYMBOL_HEIGHT;
            setScrollOffset(finalOffset);
            
            // Calculate visible symbols the same way as rendering
            const visibleSymbolPairs: Array<{symbol: SymbolType, yPos: number}> = [];
            for (let i = 0; i < TOTAL_SYMBOLS; i++) {
              let yPos = i * SYMBOL_HEIGHT - finalOffset;
              
              // Wrap around for infinite scroll (same logic as rendering)
              while (yPos < -SYMBOL_HEIGHT) {
                yPos += TOTAL_SYMBOLS * SYMBOL_HEIGHT;
              }
              while (yPos > SYMBOL_HEIGHT * (TOTAL_SYMBOLS - 1)) {
                yPos -= TOTAL_SYMBOLS * SYMBOL_HEIGHT;
              }
              
              // Check if this symbol is visible
              if (yPos >= 0 && yPos <= SYMBOL_HEIGHT * 3) {
                visibleSymbolPairs.push({symbol: updatedSymbols[i], yPos});
              }
            }
            
            // Sort by yPos (top to bottom) and extract symbols
            visibleSymbolPairs.sort((a, b) => a.yPos - b.yPos);
            const visibleSymbols = visibleSymbolPairs.map(pair => pair.symbol);
            
            // Ensure we have exactly 3 symbols (should always be the case)
            if (visibleSymbols.length !== 3) {
              console.warn(`Expected 3 visible symbols, got ${visibleSymbols.length}`);
            }
            
            setHasCompletedSpin(true);
            onSpinComplete(visibleSymbols);
          }
        };
        
        animate();
      };

      setTimeout(startSpin, delay * 200);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, hasCompletedSpin, delay, onSpinComplete]);

  return (
    <pixiContainer x={x} y={y}>
      {symbols.map((symbol, index) => {
        let yPos = index * SYMBOL_HEIGHT - scrollOffset;
        
        // Wrap around for infinite scroll
        while (yPos < -SYMBOL_HEIGHT) {
          yPos += TOTAL_SYMBOLS * SYMBOL_HEIGHT;
        }
        while (yPos > SYMBOL_HEIGHT * (TOTAL_SYMBOLS - 1)) {
          yPos -= TOTAL_SYMBOLS * SYMBOL_HEIGHT;
        }
        
        // Only render symbols that are within the visible area (0 to 240 pixels)
        const isVisible = yPos >= 0 && yPos <= SYMBOL_HEIGHT * 3;
        
        if (!isVisible) return null;
        
        return (
          <SymbolComponent
            key={`${symbol.id}-${index}-${Math.floor(scrollOffset / 10)}`}
            symbol={symbol}
            x={0}
            y={yPos}
          />
        );
      })}
    </pixiContainer>
  );
};