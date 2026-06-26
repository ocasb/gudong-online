import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export async function useZhengSkill(
  roomId: string,
  round: number,
  animal: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  await updateDoc(roomRef, {
    [`gameState.roundSkills.round${round}.zheng`]:
      {
        animal,
      },
  });
}