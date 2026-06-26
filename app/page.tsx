"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../lib/firebase";
import {
  createRoom,
  joinRoom,
} from "../lib/room";

import {
  startGame,
} from "../lib/startGame";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [playerLimit, setPlayerLimit] = useState(6);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const unsub = onSnapshot(
      doc(db, "rooms", roomId),
      (snap) => {
        const data = snap.data();

        if (!data) return;

        if (data.players) {
          setPlayers(data.players);
        }

        if (data.playerLimit) {
          setPlayerLimit(data.playerLimit);
        }
        if (
  data.status === "playing"
) {
  window.location.href =
    `/game?roomId=${roomId}`;
}
      }
    );

    return () => unsub();
  }, [roomId]);

  async function handleCreateRoom() {
  if (!playerName) {
    alert("請輸入名稱");
    return;
  }

  const result =
    await createRoom(
      playerName,
      playerLimit
    );

  localStorage.setItem(
    "playerId",
    result.playerId
  );

  setRoomId(
    result.roomId
  );

  setIsHost(true);
}

  async function handleJoinRoom() {
  if (!joinRoomId || !playerName) {
    alert("請輸入名稱與房號");
    return;
  }

  const playerId =
    await joinRoom(
      joinRoomId,
      playerName
    );

  localStorage.setItem(
    "playerId",
    playerId
  );

  setRoomId(joinRoomId);

  alert("加入成功");
}

async function handleStartGame() {
  if (!roomId) return;

  await startGame(roomId);
}

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold">
        古董局中局 Online
      </h1>

      <input
        placeholder="玩家名稱"
        value={playerName}
        onChange={(e) =>
          setPlayerName(e.target.value)
        }
        className="border p-2 rounded w-64"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setPlayerLimit(6)}
          className={`px-3 py-2 rounded border ${
            playerLimit === 6
              ? "bg-black text-white"
              : ""
          }`}
        >
          6人局
        </button>

        <button
          onClick={() => setPlayerLimit(7)}
          className={`px-3 py-2 rounded border ${
            playerLimit === 7
              ? "bg-black text-white"
              : ""
          }`}
        >
          7人局
        </button>

        <button
          onClick={() => setPlayerLimit(8)}
          className={`px-3 py-2 rounded border ${
            playerLimit === 8
              ? "bg-black text-white"
              : ""
          }`}
        >
          8人局
        </button>
      </div>

      <button
        onClick={handleCreateRoom}
        className="px-6 py-3 rounded bg-black text-white"
      >
        建立房間
      </button>

      {roomId && (
        <>
          <div className="text-xl font-bold">
            房號：{roomId}
          </div>

          <div className="w-72 border rounded p-3">
            <h2 className="font-bold mb-2">
              玩家列表
            </h2>

            <div className="mb-3 text-sm">
              目前人數：
              {players.length}
              /
              {playerLimit}
            </div>

          {players.length === 0 ? (
  <div>
    等待玩家加入...
  </div>
) : (
  players.map((p, index) => (
    <div
      key={index}
      className="mb-2"
    >
      {p.isHost ? "👑 " : ""}
      {p.color}色（{p.name}）
    </div>
  ))
)}

            {isHost &&
              players.length >=
                playerLimit && (
                <button
                  onClick={
                    handleStartGame
                  }
                  className="mt-3 w-full rounded bg-green-600 text-white py-2"
                >
                  開始遊戲
                </button>
              )}
          </div>
        </>
      )}

      <hr className="w-full max-w-md" />

      <input
        placeholder="房號"
        value={joinRoomId}
        onChange={(e) =>
          setJoinRoomId(
            e.target.value
          )
        }
        className="border p-2 rounded w-64"
      />

      <button
        onClick={handleJoinRoom}
        className="px-6 py-3 rounded border"
      >
        加入房間
      </button>
    </main>
  );
}