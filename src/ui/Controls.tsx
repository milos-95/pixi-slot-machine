import { useCallback } from 'react';
import { useSounds } from '../hooks/useSounds';

interface ControlsProps {
  onSpin: () => void;
  betAmount: number;
  onBetChange: (amount: number) => void;
  disabled: boolean;
  balance: number;
}

export default function Controls({ 
  onSpin, 
  betAmount, 
  onBetChange, 
  disabled, 
  balance 
}: ControlsProps) {
  const { playSound } = useSounds();
  const betOptions = [5, 10, 20, 50, 100];

  const handleSpin = useCallback(() => {
    playSound('spin-click');
    onSpin();
  }, [onSpin, playSound]);

  const handleBetChange = useCallback((amount: number) => {
    onBetChange(amount);
  }, [onBetChange]);

  return (
    <div className="controls">
      <div className="bet-controls">
        <label>Bet Amount:</label>
        <div className="bet-buttons">
          {betOptions.map(amount => (
            <button
              key={amount}
              className={`bet-button ${betAmount === amount ? 'active' : ''}`}
              onClick={() => handleBetChange(amount)}
              disabled={disabled || balance < amount}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>
      
      <div className="spin-controls">
        <button
          className="spin-button"
          onClick={handleSpin}
          disabled={disabled || balance < betAmount}
        >
          {disabled ? 'SPINNING...' : 'SPIN!'}
        </button>
      </div>
      
      <div className="game-info">
        <div className="current-bet">
          Current Bet: <strong>${betAmount}</strong>
        </div>
        <div className="potential-win">
          Max Win: <strong>${betAmount * 100}</strong>
        </div>
      </div>
    </div>
  );
}