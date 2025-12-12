interface HUDProps {
  balance: number;
  lastWin: number;
}

export default function HUD({ balance, lastWin }: HUDProps) {
  return (
    <div className="hud">
      <div className="hud-section">
        <div className="balance">
          <span className="label">Balance:</span>
          <span className="value">${balance}</span>
        </div>
      </div>
      
      <div className="hud-section">
        <div className="win-display">
          {lastWin > 0 && (
            <div className="win-amount">
              <span className="win-label">WIN!</span>
              <span className="win-value">${lastWin}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="hud-section">
        <div className="paytable">
          <h4>Paytable</h4>
          <div className="paytable-row">
            <span>🍋 🍋 🍋</span>
            <span>5x</span>
          </div>
          <div className="paytable-row">
            <span>🍊 🍊 🍊</span>
            <span>8x</span>
          </div>
          <div className="paytable-row">
            <span>🍒 🍒 🍒</span>
            <span>10x</span>
          </div>
          <div className="paytable-row">
            <span>🔔 🔔 🔔</span>
            <span>20x</span>
          </div>
          <div className="paytable-row">
            <span>⭐ ⭐ ⭐</span>
            <span>50x</span>
          </div>
          <div className="paytable-row">
            <span>7️⃣ 7️⃣ 7️⃣</span>
            <span>100x</span>
          </div>
        </div>
      </div>

      {/* Built by credit */}
      <div className="credit">
        Built by Milos Janic
      </div>
    </div>
  );
}