"use client";

import { useState } from "react";
import { useFangSkill } from "../../lib/skill/fang";

export function FangSkill({
  roomId,
  roomData,
  player,
}: {
  roomId: string | null;
  roomData: any;
  player: any;
}) {
  const [targetColor, setTargetColor] =
    useState("");

  const [result, setResult] =
    useState("");

  if (
    roomData?.gameState?.phase !== "action" ||
    player?.role !== "方震"
  ) {
    return null;
  }

  const round = roomData.gameState.round;

  function getCamp(role: string) {
    if (
      role === "老朝奉" ||
      role === "藥不然" ||
      role === "鄭國渠"
    ) {
      return "老朝奉陣營";
    }

    return "許願陣營";
  }

  const used =
    !!roomData?.gameState?.roundSkills?.[
      `round${round}`
    ]?.fang;

 if (used) {
  const usedTargetColor =
    roomData?.gameState?.roundSkills?.[
      `round${round}`
    ]?.fang?.targetColor;

  const targetPlayer =
    roomData?.players?.find(
      (p: any) =>
        p.color === usedTargetColor
    );

  const camp = targetPlayer
    ? getCamp(targetPlayer.role)
    : "";

  return (
    <div className="mt-4 border rounded p-4 bg-gray-100">
      <div className="font-bold">
        方震技能已使用
      </div>

      {usedTargetColor && camp && (
        <div className="mt-2 font-bold">
          {usedTargetColor}：{camp}
        </div>
      )}
    </div>
  );
}

    return (
    <div className="mt-4 border rounded p-4 bg-gray-100">
      <div className="font-bold mb-2">
        方震技能
      </div>

      <div className="text-sm mb-3">
        查看一位玩家的陣營。
      </div>

      <div className="flex flex-wrap gap-2">
        {roomData?.players
          ?.filter(
            (p: any) =>
              p.color !== player.color
          )
          .map((p: any) => (
            <button
              key={p.color}
              onClick={() =>
                setTargetColor(p.color)
              }
              className={`border rounded px-3 py-2 ${
                targetColor === p.color
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {p.color}
            </button>
          ))}
      </div>

      <button
        disabled={!targetColor}
        onClick={async () => {
          if (!roomId || !targetColor) {
            return;
          }

          const targetPlayer =
            roomData.players.find(
              (p: any) =>
                p.color === targetColor
            );

          if (!targetPlayer) {
            return;
          }

          const camp = getCamp(
            targetPlayer.role
          );

          setResult(
            `${targetColor}：${camp}`
          );

          await useFangSkill(
  roomId,
  round,
  player.color,
  player.role,
  targetColor,
  camp
);
        }}
        className="mt-4 w-full bg-blue-600 text-white rounded p-3 disabled:bg-gray-400"
      >
        查看陣營
      </button>

      {result && (
        <div className="mt-3 font-bold">
          {result}
        </div>
      )}
    </div>
  );
}