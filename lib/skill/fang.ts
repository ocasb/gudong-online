import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { addPlayerHistory } from "../history";

export async function useFangSkill(
  roomId: string,
  round: number,
  actorColor: string,
  actorRole: string,
  targetColor: string,
  result: string
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

  await addPlayerHistory(
    roomId,
    actorColor,
    {
      round,
      actorColor,
      actorRole,
      type: "identify_player",
      target: targetColor,
      result,
      note: `查看 ${targetColor} 色玩家陣營`,
    }
  );
}