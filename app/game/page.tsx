"use client";

import { Suspense } from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

import {
  identifyAnimal,
} from "../../lib/identify";

import {
  passTurn,
} from "../../lib/turn";

import {
  nextRound,
} from "../../lib/nextRound";

import {
  submitFinalIdentify,
  allPlayersIdentified,
  enterFinal,
} from "../../lib/finalIdentify";

import { finishGame } from "../../lib/finalScore";

import { PlayerCard } from "./components/PlayerCard";

import { DrugSkill } from "./DrugSkill";

import { isDrugTarget } from "../../lib/skill/checkDrug";

import { LaoSkill } from "./LaoSkill";

import { ZhengSkill } from "./ZhengSkill";

import { FangSkill } from "./FangSkill";

import { HistoryModal } from "./HistoryModal";

const DEV_MODE = true;

const ROLE_INFO: any = {
  許願: {
    title: "許願",
    team: "許願陣營",
    ability: "每輪可鑑定 2 個寶物。",
    goal: "最終分數達到 6 分以上即獲勝。",
  },
  方震: {
    title: "方震",
    team: "許願陣營",
    ability: "無鑑寶能力。",
    goal: "協助許願陣營達到 6 分。",
  },
  黃煙煙: {
    title: "黃煙煙",
    team: "許願陣營",
    ability: "隨機 1 回合無法鑑定寶物真偽。",
    goal: "協助許願陣營達到 6 分。",
  },
  木戶加奈: {
    title: "木戶加奈",
    team: "許願陣營",
    ability: "隨機 1 回合無法鑑定寶物真偽。",
    goal: "協助許願陣營達到 6 分。",
  },
  姬雲浮: {
    title: "姬雲浮",
    team: "許願陣營",
    ability: "鑑定時不受老朝奉技能影響。",
    goal: "協助許願陣營達到 6 分。",
  },
  老朝奉: {
    title: "老朝奉",
    team: "老朝奉陣營",
    ability: "鑑定後，可將所有寶物鑑定結果真假互換。",
    goal: "阻止許願陣營達到 6 分。",
  },
  藥不然: {
    title: "藥不然",
    team: "老朝奉陣營",
    ability: "鑑定後，可讓 1 名玩家無法鑑定且無法使用技能。",
    goal: "協助老朝奉陣營獲勝。",
  },
  鄭國渠: {
    title: "鄭國渠",
    team: "中立干擾",
    ability: "鑑定後，可隱藏 1 件寶物的鑑定結果。",
    goal: "干擾雙方判斷。",
  },
};

const PHASE_NAME: Record<string, string> = {
  action: "鑑寶",
  vote: "投票",
  result: "公布結果",
  identify: "最終指認",
  final: "結算",
  gameover: "遊戲結束",
};

function GamePageContent() {
  const searchParams =
    useSearchParams();

  const roomId =
    searchParams.get("roomId");

  const [player, setPlayer] =
    useState<any>(null);

  const [roomData, setRoomData] =
    useState<any>(null);

  const [identifiedResult,
    setIdentifiedResult] =
    useState("");

  const [xuyuanSelectedAnimals, setXuyuanSelectedAnimals] =
  useState<string[]>([]);

  const [hasIdentified,
  setHasIdentified] =
  useState(false);

  const [turnError, setTurnError] =
  useState("");

    const [firstVote,
  setFirstVote] =
  useState("");

const [secondVote,
  setSecondVote] =
  useState("");

  const [identifyTarget,
  setIdentifyTarget] =
  useState("");

  const [showHistory, setShowHistory] =
  useState(false);

  useEffect(() => {
    if (!roomId) return;

    const unsub = onSnapshot(
      doc(db, "rooms", roomId),
      (snap) => {
        const data = snap.data();

        if (!data) return;

        setRoomData(data);

        const playerId =
          localStorage.getItem(
            "playerId"
          );
        
        if (!playerId) return;

const me =
  data.players?.find(
    (p: any) => p.id === playerId
  );

        if (me) {
          setPlayer(me);
        }
      }
    );

    return () => unsub();
  }, [
  roomId,
  ]);

async function handleIdentify(
  animal: string
) {
  if (hasIdentified) {
    return;
  }

  if (!roomId) return;

  if (player?.role === "許願") {
    if (
      xuyuanSelectedAnimals.includes(
        animal
      )
    ) {
      return;
    }

    const nextSelected = [
      ...xuyuanSelectedAnimals,
      animal,
    ];

    setXuyuanSelectedAnimals(
      nextSelected
    );

    if (nextSelected.length < 2) {
      setIdentifiedResult(
        `已選擇 ${animal}，請再選一件寶物`
      );
      return;
    }

    const results =
      await Promise.all(
        nextSelected.map(
          async (a: string) => {
            const result =
              await identifyAnimal(
                roomId,
                a,
                player
              );

            if (result === null) {
              return `${a}：無法鑑定`;
            }

            return result
              ? `${a}：真品`
              : `${a}：贗品`;
          }
        )
      );

    setIdentifiedResult(
      results.join(" / ")
    );

    setHasIdentified(true);
    return;
  }

  const result =
    await identifyAnimal(
      roomId,
      animal,
      player
    );

  if (result === null) {
    setIdentifiedResult(
      `${animal}：無法鑑定`
    );
  } else {
    setIdentifiedResult(
      result
        ? `${animal}：真品`
        : `${animal}：贗品`
    );
  }

  setHasIdentified(true);
}

async function handlePassTurn(
  nextColor: string
) {
  const round =
  roomData?.gameState?.round;

const usedFang =
  !!roomData?.gameState?.roundSkills?.[
    `round${round}`
  ]?.fang;

if (player?.role === "方震") {
  if (!usedFang) {
    setTurnError(
      "請先選擇要鑑定的玩家"
    );
    return;
  }
} else if (player?.role === "許願") {
  if (!hasIdentified) {
    setTurnError(
      "請完成兩件寶物的鑑定"
    );
    return;
  }
} else {
  if (!hasIdentified) {
    setTurnError(
      "請先選擇要鑑定的寶物"
    );
    return;
  }
} 
  
  if (!roomId) return;

  await passTurn(
    roomId,
    nextColor
  );

  setIdentifiedResult("");
  setHasIdentified(false);
  setXuyuanSelectedAnimals([]);
}

async function submitVoteResult() {
  if (
    !roomId ||
    !firstVote ||
    !secondVote
  ) {
    return;
  }

  await updateDoc(
    doc(db, "rooms", roomId),
    {
      "gameState.voteResult": {
        firstPlace: firstVote,
        secondPlace: secondVote,
        revealed: true,
      },

      "gameState.phase": "result",
    }
  );
}

const myHistory =
  roomData?.gameState?.playerHistory?.[
    player?.color
  ] || [];

const hasSubmittedIdentify =
  !!roomData?.gameState?.identifyVotes?.[player?.color];

  const drugged =
  roomData && player
    ? isDrugTarget(
        roomData,
        player
      )
    : false;

  if (!player) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>
          載入玩家資料中...
        </div>
      </main>
    );
  }

    return (
    <main className="min-h-screen flex flex-col items-center gap-6 p-6">

      <h1 className="text-3xl font-bold">
        古董局中局 Online
      </h1>
  
 
     {DEV_MODE && (

        <div className="border rounded p-4 w-96">

<div className="mt-4 border rounded p-3 bg-gray-100">
  <div className="text-sm font-bold mb-2">
    玩家順序
  </div>

  <div className="flex flex-wrap gap-2">
    {roomData?.players?.map(
      (p: any) => {
        const isCurrent =
          p.color ===
          roomData?.gameState?.currentPlayerColor;

        return (
          <div
            key={p.color}
            className={`px-3 py-2 rounded border font-bold ${
              isCurrent
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {p.color}
          </div>
        );
      }
    )}
  </div>
</div>

   
</div>

)}

      <div className="border rounded p-6 w-96">

{DEV_MODE && (

<>

<div>
  顏色：
  {player.color}
</div>

<div>
  名稱：
  {player.name}
</div>

<div className="text-xl font-bold">
  你的角色：{player?.role}
  {player?.isHost && " 🏠"}
</div>

</>

)}

<div className="mt-4 border rounded p-4 bg-gray-50">

  <div className="text-2xl font-bold">
    {ROLE_INFO[player.role]?.title || player.role}
  </div>

  <div className="mt-2 text-sm text-gray-600">
    {ROLE_INFO[player.role]?.team}
  </div>

  <hr className="my-3" />

  <div>
    <span className="font-bold">
      能力：
    </span>
    {ROLE_INFO[player.role]?.ability}
  </div>

  <div className="mt-2">
    <span className="font-bold">
      勝利條件：
    </span>
    {ROLE_INFO[player.role]?.goal}
  </div>

<div className="mt-4 border rounded p-4">

  <div className="flex items-center justify-between">

    <div>
      第 {roomData?.gameState?.round} / 3 回合
    </div>

    <button
      onClick={() => setShowHistory(true)}
      className="text-xl hover:scale-110 transition"
      title="遊戲歷程"
    >
      🔍
    </button>

  </div>

</div>

</div>

        {player.partnerColor && (
          <div className="mt-2 text-red-600">
            互認玩家：
            {player.partnerColor}色
          </div>
        )}

        <hr className="my-4" />

        <div>
          回合：
          {
            roomData?.gameState
              ?.round
          }
        </div>

        <div>
  目前行動玩家：
  {
    roomData?.gameState
      ?.currentPlayerColor
  }色
</div>
          {roomData?.gameState?.phase ===
  "vote" &&
  player?.isHost && (

    <div className="mt-6 border rounded p-4">

      <div className="text-xl font-bold">
        投票結果輸入
      </div>

      <div className="mt-4">
        第一高票
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">

        {roomData?.gameState?.currentAnimals?.map(
          (
            animal: string
          ) => (
            <button
              key={
                animal
              }
              onClick={() =>
                setFirstVote(
                  animal
                )
              }
              className={`border rounded p-2 ${
                firstVote ===
                animal
                  ? "bg-red-500 text-white"
                  : ""
              }`}
            >
              {animal}
            </button>
          )
        )}

      </div>

      <div className="mt-4">
        第二高票
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">

        {roomData?.gameState?.currentAnimals?.map(
          (
            animal: string
          ) => (
            <button
              key={
                animal +
                "2"
              }
              onClick={() =>
                setSecondVote(
                  animal
                )
              }
              className={`border rounded p-2 ${
                secondVote ===
                animal
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              {animal}
            </button>
          )
        )}

      </div>

      <button
        onClick={
          submitVoteResult
        }
        className="mt-4 w-full bg-green-600 text-white rounded p-3"
      >
        確認投票結果
      </button>

    </div>
)}

{roomData?.gameState?.phase ===
  "result" && (

  <div className="mt-6 border rounded p-4">

    <div className="text-xl font-bold mb-4">
      投票結果
    </div>

    <div className="space-y-3">

      {roomData?.gameState
        ?.currentAnimals?.map(
          (animal: string) => {

            const voteResult =
              roomData.gameState
                .voteResult;

            const isFirst =
              voteResult
                ?.firstPlace ===
              animal;

            const isSecond =
              voteResult
                ?.secondPlace ===
              animal;

            const secondTruth =
              roomData.gameState
                ?.animals?.[
                animal
              ];

            return (
              <div
                key={animal}
                className="border rounded p-3 flex justify-between"
              >
                <span>
                  {animal}
                </span>

                <span>

                  {isFirst &&
                    "🥇"}

                  {isSecond &&
                    !voteResult.revealed &&
                    "🥈"}

                  {isSecond &&
                    voteResult.revealed &&
                    (secondTruth
                      ? "✅真品"
                      : "❌贗品")}

                </span>

              </div>
            );
          }
        )}

    </div>
{player?.isHost && (

  <button
    onClick={async () => {

      if (!roomId) return;

      await nextRound(roomId);

    }}
    className="mt-4 w-full bg-blue-600 text-white rounded p-3"
  >
    {roomData?.gameState?.round === 3
      ? "進入最終指認"
      : "開始下一回合"}
  </button>

)}
    </div>


)}

{roomData?.gameState?.phase === "identify" && (

<div className="mt-6 border rounded p-4">

  {hasSubmittedIdentify ? (

    <>
      <div className="text-xl font-bold">
        已完成指認
      </div>

      <div className="mt-4 text-gray-600">
        等待所有玩家完成指認中...
      </div>
    </>

  ) : (

    <>

      <div className="text-xl font-bold mb-4">
        最終指認
      </div>

      <div className="mb-4">

        {player.role === "老朝奉" &&
          "請指認許願"}

        {player.role === "藥不然" &&
          "請指認方震"}

        {[
          "許願",
          "方震",
          "黃煙煙",
          "木戶加奈",
          "姬雲浮",
        ].includes(player.role) &&
          "請指認老朝奉"}

        {player.role === "鄭國渠" &&
          "你也可以指認一位玩家"}

      </div>

      <div className="grid grid-cols-2 gap-2">

        {roomData?.players?.map(
          (p: any) => (

            <button
              key={p.color}
              onClick={() =>
                setIdentifyTarget(
                  p.color
                )
              }
              className={`border rounded p-3 ${
                identifyTarget === p.color
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              {p.color}
            </button>

          )
        )}

      </div>

      <button
        disabled={!identifyTarget}
        onClick={async () => {

          if (
            !roomId ||
            !player ||
            !identifyTarget
          ) {
            return;
          }

          await submitFinalIdentify(
            roomId,
            player.color,
            identifyTarget
          );

          const finished =
            await allPlayersIdentified(
              roomId
            );

          if (finished) {
            await enterFinal(
              roomId
            );
          }

        }}
        className="mt-4 w-full bg-green-600 text-white rounded p-3 disabled:bg-gray-400"
      >
        確認指認
      </button>

    </>

  )}

</div>

)}

{roomData?.gameState?.phase === "final" && (

<div className="mt-6 border rounded p-4">

  <div className="text-xl font-bold mb-4">
    最終結算
  </div>

  <div>
    所有玩家已完成指認。
  </div>

  {player?.isHost ? (

    <button
      className="mt-4 w-full bg-red-600 text-white rounded p-3"
      onClick={async () => {

        if (!roomId || !roomData) return;

        await finishGame(
          roomId,
          roomData
        );

      }}
    >
      開始結算
    </button>

  ) : (

    <div className="mt-4 text-gray-600">
      等待房主結算...
    </div>

  )}

</div>

)}

{roomData?.gameState?.phase === "gameover" && (

  <div className="mt-6 border rounded p-4">

    <div className="text-2xl font-bold">
      遊戲結束
    </div>

    <div className="mt-4">
      寶物分：
      {roomData.gameState.scoreResult.relicScore}
    </div>

    <div>
      正確指認老朝奉：
      {roomData.gameState.scoreResult.identifyScore}
    </div>

    <div>
      許願成功躲藏：
      {roomData.gameState.scoreResult.laoScore}
    </div>

    <div>
      方震成功躲藏：
      {roomData.gameState.scoreResult.yaoScore}
    </div>

    <hr className="my-4" />

    <div className="text-xl font-bold">
      總分：
      {roomData.gameState.scoreResult.total}
    </div>

    <div className="mt-4 text-xl">

      {roomData.gameState.scoreResult.winner ===
      "xuyuan"
        ? "🎉 許願陣營勝利"
        : "😈 老朝奉陣營勝利"}

    </div>

  </div>

)}

        {roomData?.gameState?.phase ===
  "action" &&
roomData?.gameState
  ?.currentPlayerColor ===
  player.color ? (

          <>
            <div className="mt-4 text-green-600 font-bold">
  輪到你行動
</div>

{drugged ? (

  <div className="mt-4 border rounded p-4 bg-red-100">

    <div className="font-bold text-red-600">
      你被藥不然偷襲！
    </div>

    <div className="mt-2">
      本回合不能鑑寶。
    </div>

  </div>

) : (

<>

<DrugSkill
  roomId={roomId}
  roomData={roomData}
  player={player}
  />

  <LaoSkill
  roomId={roomId}
  roomData={roomData}
  player={player}
/>

<ZhengSkill
  roomId={roomId}
  roomData={roomData}
  player={player}
/>

<FangSkill
  roomId={roomId}
  roomData={roomData}
  player={player}
/>


{player?.role !== "方震" && (
  <>
            <div className="mt-4">
              本回合寶物
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">

              {roomData?.gameState?.currentAnimals?.map(
                (
                  animal: string
                ) => (
                  <button
  key={animal}
  disabled={hasIdentified}
  onClick={() =>
    handleIdentify(
      animal
    )
  }
  className="border rounded p-3"
>
                    {animal}
                  </button>
                )
              )}

            </div>

            {identifiedResult && (
              <div className="mt-4 text-xl font-bold text-blue-600">
                {identifiedResult}
              </div>
            )}
{hasIdentified && (
  <div className="mt-3 text-green-600 font-bold">
    ✅ 已完成鑑寶
  </div>
)}
            <hr className="my-4" />

            </>
)}</>
)}
            <div className="font-bold">
  指定下一位玩家
</div>

<div className="flex flex-wrap gap-2 mt-2">

  {roomData?.players?.filter(
    (p: any) =>
      !roomData.gameState.actedPlayers.includes(
        p.color
      ) &&
      p.color !== player.color
  ).length > 0 ? (

    roomData?.players
      ?.filter(
        (p: any) =>
          !roomData.gameState.actedPlayers.includes(
            p.color
          ) &&
          p.color !== player.color
      )
      .map(
        (p: any) => (
          <button
            key={p.color}
            onClick={() =>
              handlePassTurn(
                p.color
              )
            }
            className="border rounded px-3 py-2"
          >
            {p.color}
          </button>
        )
      )

  ) : (

    <button
      onClick={() =>
        handlePassTurn("")
      }
      className="bg-red-500 text-white rounded px-4 py-2"
    >
      結束本回合
    </button>

  )}

            </div>
          </>
        ) : roomData?.gameState?.phase ===
  "action" ? (
  <div className="mt-6 text-gray-500">
            等待
            {
              roomData?.gameState
                ?.currentPlayerColor
            }
            色玩家行動...
         </div>
) : null}

        <HistoryModal
          open={showHistory}
          onClose={() => setShowHistory(false)}
          history={myHistory}
        />


      </div>
    </main>
  );
}
export default function GamePage() {
  return (
    <Suspense
      fallback={<div>載入中...</div>}
    >
      <GamePageContent />
    </Suspense>
  );
}