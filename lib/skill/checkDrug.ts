export function isDrugTarget(
  roomData: any,
  player: any
) {
  if (!roomData || !player) {
    return false;
  }

  const round =
    roomData?.gameState?.round;

  const byPending =
    roomData?.gameState?.pendingAttacks?.includes(
      player.color
    );

  const byRound =
    roomData?.gameState?.debuffs?.[
      `round${round}`
    ]?.includes(player.color);

  return byPending || byRound;
}