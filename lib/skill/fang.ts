import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export async function useFangSkill(
  roomId: string,
  round: number,
  targetColor: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  await updateDoc(roomRef, {
    [`gameState.roundSkills.round${round}.fang`]:
      {
        targetColor,
      },
  });
}