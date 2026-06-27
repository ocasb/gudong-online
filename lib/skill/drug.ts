import {
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { db } from "../firebase";
import { addPlayerHistory } from "../history";

export type DrugDebuff = {
  color: string;
  round: number;
};

export async function useDrugSkill(
  roomId: string,
  round: number,
  actorColor: string,
  actorRole: string,
  targetColor: string,
  debuffs: DrugDebuff[]
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const roundKey =
    `round${round}`;

  const attackColors =
  debuffs.map((d) => d.color);

const pendingColors = debuffs
  .filter((debuff) => debuff.round === round)
  .map((debuff) => debuff.color);

const updateData: any = {
  [`gameState.roundSkills.${roundKey}.drug.targetColor`]:
    targetColor,
};

if (pendingColors.length > 0) {
  updateData["gameState.pendingAttacks"] =
    arrayUnion(...pendingColors);
}

  debuffs.forEach((debuff) => {
    updateData[
      `gameState.debuffs.round${debuff.round}`
    ] = arrayUnion(debuff.color);
  });

  await updateDoc(roomRef, updateData);

  await addPlayerHistory(
    roomId,
    actorColor,
    {
      round,
      actorColor,
      actorRole,
      type: "skip_player",
      target: targetColor,
      note: `偷襲 ${targetColor} 色玩家`,
    }
  );
}