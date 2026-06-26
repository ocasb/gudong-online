import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { addPlayerHistory } from "../history";

export async function useDrugSkill(
  roomId: string,
  round: number,
  actorColor: string,
  actorRole: string,
  targetColor: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const roundKey =
    `round${round}`;

  await updateDoc(roomRef, {
    [`gameState.roundSkills.${roundKey}.drug.targetColor`]:
      targetColor,
  });

  await addPlayerHistory(
    roomId,
    actorColor,
    {
      round,
      actorColor,
      actorRole,
      type: "skip_player",
      target: targetColor,
      note: `偷襲 ${targetColor} 色玩家，使其跳過本回合行動`,
    }
  );
}