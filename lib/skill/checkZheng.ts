export function shouldBlockByZheng(
  roomData: any,
  animal: string
) {
  const round =
    roomData?.gameState?.round;

  const zhengAnimal =
    roomData?.gameState?.roundSkills?.[
      `round${round}`
    ]?.zheng?.animal;

  if (!zhengAnimal) {
    return false;
  }

  return zhengAnimal === animal;
}