export function shouldDebuffBlock(
  roomData: any,
  player: any
) {
  const role =
    player?.role;

  if (
    role !== "黃煙煙" &&
    role !== "木戶加奈"
  ) {
    return false;
  }

  const round =
    roomData?.gameState?.round;

  const debuffRound =
    roomData?.gameState?.debuffRounds?.[
      role
    ];

  return round === debuffRound;
}