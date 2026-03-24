import { JSX } from "react";

type MoveHistoryProps = {
  moveHistory: any[];
};

export default function MoveHistory({ moveHistory }: MoveHistoryProps): JSX.Element {
  
  // Group moves into pairs (White, Black)
  const groupedMoves = [];
  if (moveHistory) {
    for (let i = 0; i < moveHistory.length; i += 2) {
      groupedMoves.push({
        white: moveHistory[i],
        black: moveHistory[i + 1] || null
      });
    }
  }

  const formatSquare = (row: number, col: number) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return `${letters[col]}${8 - row}`;
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] w-full bg-[#ffffff] shadow-[0_24px_50px_-12px_rgba(25,28,25,0.04)] rounded-2xl overflow-hidden font-inter border border-transparent">
      <div className="p-8 pb-6">
        <h2 className="font-manrope text-[1.75rem] font-bold text-[#191c19] leading-tight tracking-tight">
          Move History
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-4">
        {groupedMoves.map((turn, i) => (
          <div key={i} className="flex items-center text-[0.875rem] w-full">
            <span className="w-10 text-[#393a29] font-semibold text-right pr-6">{i + 1}.</span>
            <div className="flex gap-10 flex-1">
              <span className="text-[#191c19] font-medium w-12 tracking-wide">
                 {turn.white ? `${formatSquare(turn.white.fromRow, turn.white.fromCol)}-${formatSquare(turn.white.toRow, turn.white.toCol)}` : ""}
              </span>
              <span className="text-[#191c19] font-medium w-12 tracking-wide">
                 {turn.black ? `${formatSquare(turn.black.fromRow, turn.black.fromCol)}-${formatSquare(turn.black.toRow, turn.black.toCol)}` : ""}
              </span>
            </div>
          </div>
        ))}
        {groupedMoves.length === 0 && (
          <div className="text-[#393a29] font-medium italic mt-2 text-sm">The board is set.</div>
        )}
      </div>
    </div>
  );
}
