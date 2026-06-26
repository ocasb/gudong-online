const AFFECTED_ROLES = [
  "許願",
  "方震",
  "黃煙煙",
  "木戶加奈",
];

export function shouldReverseByLao(
  roomData: any,
  player: any
) {
  const gameState =
    roomData.gameState;

  const round =
    gameState.round;

  const laoSkill =
    gameState.roundSkills?.[
      `round${round}`
    ]?.lao;

  if (!laoSkill?.enabled) {
    return false;
  }

  if (
    !AFFECTED_ROLES.includes(
      player.role
    )
  ) {
    return false;
  }

  const actedPlayers =
    gameState.actedPlayers || [];

  const laoPlayer =
    roomData.players.find(
      (p: any) =>
        p.role === "老朝奉"
    );

  if (!laoPlayer) {
    return false;
  }

  const laoHasActed =
    actedPlayers.includes(
      laoPlayer.color
    );

  if (!laoHasActed) {
    return false;
  }

  return true;
}