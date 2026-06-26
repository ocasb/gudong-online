import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const COLORS = [
  "紅",
  "橙",
  "黃",
  "綠",
  "藍",
  "紫",
  "白",
  "黑",
];

export async function createRoom(
  hostName: string,
  playerLimit: number
) {
  const roomId = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const playerId =
    Date.now().toString();

  await setDoc(
    doc(db, "rooms", roomId),
    {
      roomId,
      createdAt: Date.now(),
      status: "waiting",
      playerLimit,

      players: [
        {
          id: playerId,
          name: hostName,
          color: COLORS[0],
          joinedAt: Date.now(),
          isHost: true,
        },
      ],
    }
  );

  return {
    roomId,
    playerId,
  };
}

export async function joinRoom(
  roomId: string,
  playerName: string
) {
  const roomRef = doc(
    db,
    "rooms",
    roomId
  );

  const snap = await getDoc(
    roomRef
  );

  if (!snap.exists()) {
    throw new Error(
      "房間不存在"
    );
  }

  const room = snap.data();

  const players =
    room.players || [];

  const playerLimit =
    room.playerLimit || 8;

  if (
    players.length >= playerLimit
  ) {
    throw new Error(
      "房間已滿"
    );
  }

  const color =
    COLORS[players.length];

  const playerId =
    Date.now().toString() +
    Math.floor(
      Math.random() * 100000
    );

  await updateDoc(roomRef, {
    players: arrayUnion({
      id: playerId,
      name: playerName,
      color,
      joinedAt: Date.now(),
      isHost: false,
    }),
  });

  return playerId;
}