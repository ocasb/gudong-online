import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { addPlayerHistory } from "../history";

export async function useLaoSkill(
  roomId: string,
  round: number,
  actorColor: string,
  actorRole: string
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

  await addPlayerHistory(
    roomId,
    actorColor,
    {
      round,
      actorColor,
      actorRole,
      type: "reverse_result",
      note:
        "發動技能，之後所有玩家的鑑定結果反轉",
    }
  );
}