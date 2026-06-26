export function isDrugTarget(
  roomData: any,
  player: any
) {
  const round =
    roomData?.gameState?.round;

  const roundKey =
    `round${round}`;

  const debuffedPlayers =
    roomData?.gameState?.debuffs?.[
      roundKey
    ] || [];

  return debuffedPlayers.includes(
    player?.color
  );
}