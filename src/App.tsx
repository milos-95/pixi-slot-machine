import { useState } from 'react'
import SlotMachine from './game/SlotMachine'
import Controls from './ui/Controls'
import HUD from './ui/HUD'
import type { GameState } from './utils/GameState'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState>({
    balance: 1000,
    betAmount: 10,
    isSpinning: false,
    lastWin: 0
  })

  const handleSpin = () => {
    if (gameState.balance >= gameState.betAmount && !gameState.isSpinning) {
      setGameState(prev => ({
        ...prev,
        balance: prev.balance - prev.betAmount,
        isSpinning: true,
        lastWin: 0
      }))
    }
  }

  const handleSpinComplete = (winAmount: number) => {
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + winAmount,
      isSpinning: false,
      lastWin: winAmount
    }))
  }

  return (
    <div className="slot-machine-app">
      <HUD balance={gameState.balance} lastWin={gameState.lastWin} />
      <SlotMachine 
        onSpinComplete={handleSpinComplete}
        isSpinning={gameState.isSpinning}
        betAmount={gameState.betAmount}
      />
      <Controls 
        onSpin={handleSpin}
        betAmount={gameState.betAmount}
        onBetChange={(amount) => setGameState(prev => ({...prev, betAmount: amount}))}
        disabled={gameState.isSpinning || gameState.balance < gameState.betAmount}
        balance={gameState.balance}
      />
    </div>
  )
}

export default App