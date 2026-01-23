import { Messenger, Phone } from "@/lib/generated/prisma/client";
import { Column } from "@tanstack/react-table";
import { IncludedHouse } from "@/app/actions/houses";
import { CSSProperties } from "react";

export const getCommonPinningStyles = (
  column: Column<IncludedHouse>,
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export const makeIncludedHousePhone = (phone: Phone) => ({
  phone,
  id: "",
  houseId: "",
  phoneId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const makeIncludedHouseMessenger = (messenger: Messenger) => ({
  messenger,
  id: "",
  houseId: "",
  messengerId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});
