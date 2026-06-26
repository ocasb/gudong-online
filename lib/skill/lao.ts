import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export async function useLaoSkill(
  roomId: string,
  round: number
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const roundKey =
    `round${round}`;

  await updateDoc(roomRef, {
    [`gameState.roundSkills.${roundKey}.lao.enabled`]:
      true,
  });
}