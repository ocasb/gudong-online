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
    ability: "無法鑑寶，可查看一名玩家陣營。",
    goal: "協助許願陣營達到 6 分。",
  },
  黃煙煙: {
    title: "黃煙煙",
    team: "許願陣營",
    ability: "一般鑑定。",
    goal: "協助許願陣營達到 6 分。",
  },
  木戶加奈: {
    title: "木戶加奈",
    team: "許願陣營",
    ability: "一般鑑定。",
    goal: "協助許願陣營達到 6 分。",
  },
  姬雲浮: {
    title: "姬雲浮",
    team: "許願陣營",
    ability: "一般鑑定。",
    goal: "協助許願陣營達到 6 分。",
  },
  老朝奉: {
    title: "老朝奉",
    team: "老朝奉陣營",
    ability: "可使他之後所有玩家的鑑定結果反轉。",
    goal: "阻止許願陣營達到 6 分。",
  },
  藥不然: {
    title: "藥不然",
    team: "老朝奉陣營",
    ability: "可使一名玩家本回合跳過行動。",
    goal: "協助老朝奉陣營獲勝。",
  },
  鄭國渠: {
    title: "鄭國渠",
    team: "老朝奉陣營",
    ability: "可使一件寶物顯示無法鑑定。",
    goal: "協助老朝奉陣營獲勝。",
  },
};

export function PlayerCard({
  player,
}: {
  player: any;
}) {
  const info =
    ROLE_INFO[player?.role];

  return (
    <div className="mt-4 border rounded p-4 bg-gray-50">

      <div className="text-2xl font-bold">
        {info?.title || player?.role}
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {info?.team}
      </div>

      <hr className="my-3" />

      <div>
        <span className="font-bold">
          能力：
        </span>
        {info?.ability}
      </div>

      <div className="mt-2">
        <span className="font-bold">
          勝利條件：
        </span>
        {info?.goal}
      </div>

    </div>
  );
}