import React from "react";
import useQuoteStore from "@/store/quoteStore";
import { useVirtualizer } from "@tanstack/react-virtual";

function GasketList() {
  const gaskets = useQuoteStore((state) => state.gaskets);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: gaskets.length,
    getScrollElement: () => parentRef.current,
    itemSize: () => 35,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-64 overflow-y-auto border rounded-md">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
            className="p-2 border-b"
          >
            {gaskets[virtualItem.index].quantity}x{" "}
            {gaskets[virtualItem.index].shape === "rectangle"
              ? `${gaskets[virtualItem.index].width}x${
                  gaskets[virtualItem.index].height
                }`
              : `${gaskets[virtualItem.index].diameter}" Dia`}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GasketList;
