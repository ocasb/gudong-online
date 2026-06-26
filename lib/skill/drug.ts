import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export async function useDrugSkill(
  roomId: string,
  round: number,
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
}