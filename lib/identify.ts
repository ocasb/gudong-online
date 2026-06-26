import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { shouldReverseByLao } from "./skill/checkLao";
import { shouldBlockByZheng } from "./skill/checkZheng";
import { shouldDebuffBlock } from "./skill/checkDebuff";

export async function identifyAnimal(
  roomId: string,
  animal: string,
  player: any
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const snap =
    await getDoc(roomRef);

  const data = snap.data();

  if (!data) return null;

  const animals =
    data.gameState.animals;

    if (
  shouldBlockByZheng(
    data,
    animal
  )
) {
  return null;
}

if (
  shouldDebuffBlock(
    data,
    player
  )
) {
  return null;
}
  let result = animals[animal];

  if (
    shouldReverseByLao(
      data,
      player
    )
  ) {
    result = !result;
  }

  return result;
}