"use client";

function getHistoryIcon(type: string) {
  switch (type) {
    case "identify_animal":
      return "🔍";

    case "identify_player":
      return "👤";

    case "block_animal":
      return "🚫";

    case "skip_player":
      return "👊";

    case "reverse_result":
      return "🔄";

    case "vote_result":
      return "🗳️";

    default:
      return "📌";
  }
}

export function HistoryModal({
  open,
  onClose,
  history,
}: {
  open: boolean;
  onClose: () => void;
  history: any[];
}) {
  console.log("HistoryModal", open);

if (!open) return null;
const groupedHistory = history.reduce(
  (acc: any, item: any) => {
    if (!acc[item.round]) {
      acc[item.round] = [];
    }

    acc[item.round].push(item);

    return acc;
  },
  {}
);
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold">
            🔍 遊戲歷程
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-xl"
          >
            ×
          </button>
        </div>

        {!history || history.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            目前還沒有任何歷程
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
           {Object.entries(groupedHistory).map(
  ([round, records]: any) => (
    <div
  key={round}
  className="mb-5"
>
      <div className="font-bold border-b pb-1 mb-2">
        📍 第 {round} 回合
      </div>

      <div className="space-y-3">
        {records
  .sort(
    (a: any, b: any) =>
      a.createdAt - b.createdAt
  )
  .map(
          (item: any, index: number) => (
            <div
              key={index}
              className="border rounded-lg p-3 bg-gray-50"
            >
              <div className="flex items-center gap-2 font-medium">
                <span className="text-xl">
                  {getHistoryIcon(item.type)}
                </span>

                <span>
                  {item.note}
                </span>
              </div>

              {item.result && (
                <div className="mt-2 ml-8 text-sm text-blue-600 font-bold">
                  結果：{item.result}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
)}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-800 text-white rounded-lg p-2"
        >
          關閉
        </button>
      </div>
    </div>
  );
}