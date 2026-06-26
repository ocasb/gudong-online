export function isDrugTarget(
  roomData: any,
  player: any
) {
  const round =
    roomData.gameState.round;

  const target =
    roomData.gameState
      ?.roundSkills?.[
        `round${round}`
      ]?.drug?.targetColor;

  if (!target) {
    return false;
  }

  // 自己就是被偷襲目標
  if (player.color === target) {
    return true;
  }

  // ===== 特殊規則 =====
  // 方震被偷襲，許願一起被偷襲

  const players =
    roomData.players;

  const fang =
    players.find(
      (p: any) =>
        p.role === "方震"
    );

  const xuyuan =
    players.find(
      (p: any) =>
        p.role === "許願"
    );

  if (
    fang &&
    xuyuan &&
    target === fang.color &&
    player.color === xuyuan.color
  ) {
    return true;
  }

  return false;
}