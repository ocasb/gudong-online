import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { addPlayerHistory } from "../history";

export async function useZhengSkill(
  roomId: string,
  round: number,
  actorColor: string,
  actorRole: string,
  animal: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  await updateDoc(roomRef, {
    [`gameState.roundSkills.round${round}.zheng`]: {
      animal,
    },
  });

  await addPlayerHistory(
    roomId,
    actorColor,
    {
      round,
      actorColor,
      actorRole,
      type: "block_animal",
      target: animal,
      note: `封鎖 ${animal}，使其無法鑑定`,
    }
  );
}