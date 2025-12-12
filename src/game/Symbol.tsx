import { TextStyle } from 'pixi.js';

interface SymbolProps {
  symbol: { id: string; emoji: string; value: number };
  x: number;
  y: number;
}

export const SymbolComponent = ({ symbol, x, y }: SymbolProps) => {
  const textStyle = new TextStyle({
    fontSize: 60,
    fill: '#ffffff',
    stroke: '#000000',
  });

  return (
    <pixiText
      text={symbol.emoji}
      style={textStyle}
      x={x}
      y={y}
      anchor={0.5}
    />
  );
};