"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BathroomCount,
  BedroomCount,
  FacingMaterial,
  Finishing,
  FloorCount,
  Heating,
  HouseStatus,
  HouseType,
  Insulation,
  LandCategory,
  SaleStatus,
  WallMaterial,
} from "@/lib/types";
import { FC, useActionState, useEffect, useTransition } from "react";
import {
  createHouse,
  deleteHouse,
  HouseInput,
  updateHouse,
} from "@/app/actions/houses";
import { FieldDescription } from "@/components/ui/field";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HouseForm } from "./form";

const defaultCreateState: HouseInput = {
  name: "",
  description: "",
  districtId: "",
  type: HouseType.LandPlot,
  price: 0,
  houseArea: 0,
  plotArea: 0,
  landCategory: LandCategory.IZHS,
  finishing: Finishing.CleanFinish,
  heating: Heating.Gas,
  asphaltToHouse: false,
  closedComplex: false,
  floor: FloorCount.One,
  bedroom: BedroomCount.One,
  separatedKitchenLiving: false,
  bathroom: BathroomCount.One,
  facingMaterial: FacingMaterial.BarkBeetlePlaster,
  wallMaterial: WallMaterial.Wood,
  insulation: Insulation.FoamPlastic,
  hasMinimumDownPayment: true,
  houseStatus: HouseStatus.BuiltHouse,
  saleStatus: SaleStatus.Available,

  latitude: 0,
  longitude: 0,
  developerId: "",
  messengers: [],
  phones: [],
  cadastralNumber: "",
  yandexDiskLink: "",
  isActive: true,
};
const createInitialState = { error: "", success: false };
const updateInitialState = { error: "", success: false };
const deleteInitialState = { error: "" };

interface Props {
  houses: HouseInput[];
}

export const HousesTable: FC<Props> = ({ houses }) => {
  const [isPending, startTransition] = useTransition();

  const [createState, createFormAction] = useActionState(
    createHouse,
    createInitialState,
  );
  const [updateState, updateFormAction] = useActionState(
    updateHouse,
    updateInitialState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteHouse,
    deleteInitialState,
  );

  const [isCreateMode, setIsCreateMode] = React.useState(false);
  const [creatingValues, setCreatingValues] =
    React.useState<HouseInput>(defaultCreateState);
  const handleCreate = async (data: HouseInput) => {
    startTransition(async () => {
      createFormAction(data);
    });
  };

  const [editingValues, setEditingValues] = React.useState<HouseInput | null>(
    null,
  );
  const handleEdit = (house: HouseInput) => {
    setEditingValues(house);
  };
  const handleCancelEdit = () => {
    setEditingValues(null);
  };
  const handleSaveEdit = async (house: HouseInput) => {
    startTransition(async () => {
      updateFormAction(house);
    });
  };

  const handleDelete = async (houseId: string) => {
    startTransition(async () => {
      deleteFormAction(houseId);
    });
  };

  const columns: ColumnDef<HouseInput>[] = [
    {
      accessorKey: "name",
      header: "Название объекта",
    },
    {
      accessorKey: "description",
      header: "Описание",
    },
    {
      accessorKey: "districtId",
      header: "Район",
    },
    {
      accessorKey: "type",
      header: "Вид объекта",
    },
    {
      accessorKey: "price",
      header: "Цена",
    },
    {
      accessorKey: "houseArea",
      header: "Площадь дома",
    },
    {
      accessorKey: "plotArea",
      header: "Площадь участка",
    },
    {
      accessorKey: "landCategory",
      header: "Категория земли",
    },
    {
      accessorKey: "finishing",
      header: "Отделка",
    },
    {
      accessorKey: "heating",
      header: "Отопление",
    },
    {
      accessorKey: "asphaltToHouse",
      header: "Асфальт до дома",
    },
    {
      accessorKey: "closedComplex",
      header: "Закрытый ЖК",
    },
    {
      accessorKey: "floor",
      header: "Количество этажей",
    },
    {
      accessorKey: "bedroom",
      header: "Количество спален",
    },
    {
      accessorKey: "separatedKitchenLiving",
      header: "Раздельная кухня и гостинная",
    },
    {
      accessorKey: "bathroom",
      header: "Количество сан. узлов",
    },
    {
      accessorKey: "facingMaterial",
      header: "Материал облицовки",
    },
    {
      accessorKey: "wallMaterial",
      header: "Материал стен",
    },
    {
      accessorKey: "insulation",
      header: "Утеплитель",
    },
    {
      accessorKey: "hasMinimumDownPayment",
      header: "Дом без первоначального взноса?",
    },
    {
      accessorKey: "houseStatus",
      header: "Статус объекта",
    },
    {
      accessorKey: "saleStatus",
      header: "Статус продажи объекта",
    },

    {
      accessorKey: "latitude",
      header: "Широта",
    },
    {
      accessorKey: "longitude",
      header: "Долгота",
    },
    {
      accessorKey: "developerId",
      header: "Застройщик",
    },
    {
      accessorKey: "messengers",
      header: "Мессенджеры",
    },
    {
      accessorKey: "phones",
      header: "Телефоны",
    },
    {
      accessorKey: "cadastralNumber",
      header: "Кадастровый номер",
    },
    {
      accessorKey: "yandexDiskLink",
      header: "Ссылка на яндекс диск",
    },
    {
      accessorKey: "isActive",
      header: "Показывать покупателям",
    },
    {
      accessorKey: "_actions",
      header: "",
      size: 80,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={isPending}
              onClick={() => {
                handleEdit(row.original);
              }}
            >
              <Edit className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Редактировать</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="text-red-500"
              disabled={isPending}
              onClick={async () => {
                await handleDelete(row.original?.id ?? "");
              }}
            >
              <Trash2 className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Удалить</span>
            </Button>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data: houses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (createState.success) {
      setIsCreateMode(false);
      setCreatingValues(defaultCreateState);
    }
  }, [createState]);

  useEffect(() => {
    if (updateState.success) {
      setEditingValues(null);
    }
  }, [updateState]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4 px-4">
        <h3 className="text-xl font-semibold">Объекты</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIsCreateMode(true);
          }}
        >
          <Plus className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>

      {deleteState?.error && (
        <FieldDescription className="text-center text-red-500 mb-4">
          {deleteState.error}
        </FieldDescription>
      )}

      <div className="overflow-hidden rounded-md border">
        <Table style={{ minHeight: "calc(100vh - 157px)" }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isCreateMode}
        onOpenChange={() => {
          setIsCreateMode(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {creatingValues && (
            <HouseForm
              formTitle="Новый объект"
              house={creatingValues}
              isPending={isPending}
              errorMessage={createState?.error}
              onCancel={() => {
                setIsCreateMode(false);
              }}
              onSave={handleCreate}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingValues)}
        onOpenChange={() => {
          setEditingValues(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {editingValues && (
            <HouseForm
              formTitle="Редактировать"
              house={editingValues}
              isPending={isPending}
              errorMessage={updateState?.error}
              onCancel={handleCancelEdit}
              onSave={handleSaveEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
