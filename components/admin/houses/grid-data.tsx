"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Image from "next/image";
import { Messenger, Phone } from "@prisma/client";
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
  mappers,
  SaleStatus,
  WallMaterial,
} from "@/lib/types";
import { FC, useActionState, useEffect, useTransition } from "react";
import {
  createHouse,
  deleteHouse,
  IncludedHouse,
  updateHouse,
} from "@/app/actions/houses";
import { FieldDescription } from "@/components/ui/field";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { Dictionaries, HouseForm } from "./form";
import {
  formatNumber,
  getCommonPinningStyles,
  makeIncludedHouseMessenger,
  makeIncludedHousePhone,
} from "./utils";

const createInitialState = { error: "", success: false, fieldName: "" };
const updateInitialState = { error: "", success: false, fieldName: "" };
const deleteInitialState = { error: "" };

interface Props {
  houses: IncludedHouse[];
  dictionaries: Dictionaries;
  phones: Phone[];
  messengers: Messenger[];
}

export const HousesTable: FC<Props> = ({
  houses,
  dictionaries,
  phones,
  messengers,
}) => {
  const defaultCreateState: IncludedHouse = {
    id: "",
    humanCode: "",
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
    phones: phones
      .filter(({ isDefault }) => isDefault)
      .map(makeIncludedHousePhone),
    messengers: messengers
      .filter(({ isDefault }) => isDefault)
      .map(makeIncludedHouseMessenger),
    cadastralNumber: "",
    yandexDiskLink: "",
    gallery: [],
    layout: "",
    isActive: true,
    isArchive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
    React.useState<IncludedHouse>(defaultCreateState);
  const handleCreate = async (data: IncludedHouse) => {
    startTransition(async () => {
      createFormAction(data);
    });
  };

  const [editingValues, setEditingValues] =
    React.useState<IncludedHouse | null>(null);
  const handleEdit = (house: IncludedHouse) => {
    setEditingValues(house);
  };
  const handleCancelEdit = () => {
    setEditingValues(null);
  };
  const handleSaveEdit = async (house: IncludedHouse) => {
    startTransition(async () => {
      updateFormAction(house);
    });
  };

  const handleDelete = async (houseId: string) => {
    startTransition(async () => {
      deleteFormAction(houseId);
    });
  };

  const columns: ColumnDef<IncludedHouse>[] = [
    {
      accessorKey: "name",
      header: "Название объекта",
    },
    {
      accessorKey: "humanCode",
      header: "Артикул",
      cell: ({ row }) => {
        return <div>{formatNumber(Number(row.original.humanCode))}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Описание",
      cell: ({ row }) => {
        const initObject = row.original.description
          ? JSON.parse(row.original.description as string)
          : "";
        if (!initObject) {
          return null;
        }

        const firstLineText =
          initObject.root?.children.at(0).children.at(0)?.text ?? "";

        return (
          <div className="max-w-50 overflow-hidden text-ellipsis">
            {firstLineText}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Показывать",
      cell: ({ row }) => {
        const id = `is-default-${row.id}`;

        return <Switch id={id} checked={row.original.isActive} disabled />;
      },
    },
    {
      accessorKey: "districtId",
      header: "Район",
      cell: ({ row }) => {
        if (!dictionaries?.districts) {
          return row.original.districtId;
        }

        return (
          dictionaries.districts.find(
            ({ id }) => id === row.original.districtId,
          )?.title ?? "Район не найден"
        );
      },
    },
    {
      accessorKey: "type",
      header: "Вид объекта",
      cell: ({ row }) => mappers.typeMapper[row.original.type],
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
      cell: ({ row }) => mappers.landCategoryMapper[row.original.landCategory],
    },
    {
      accessorKey: "finishing",
      header: "Отделка",
      cell: ({ row }) => mappers.finishingMapper[row.original.finishing],
    },
    {
      accessorKey: "heating",
      header: "Отопление",
      cell: ({ row }) => mappers.heatingMapper[row.original.heating],
    },
    {
      accessorKey: "asphaltToHouse",
      header: "Асфальт до дома",
      cell: ({ row }) => {
        const id = `is-default-${row.id}`;

        return (
          <Switch id={id} checked={row.original.asphaltToHouse} disabled />
        );
      },
    },
    {
      accessorKey: "closedComplex",
      header: "Закрытый ЖК",
      cell: ({ row }) => {
        const id = `is-default-${row.id}`;

        return <Switch id={id} checked={row.original.closedComplex} disabled />;
      },
    },
    {
      accessorKey: "floor",
      header: "Количество этажей",
      cell: ({ row }) => mappers.floorCountMapper[row.original.floor],
    },
    {
      accessorKey: "bedroom",
      header: "Количество спален",
      cell: ({ row }) => mappers.bedroomCountMapper[row.original.bedroom],
    },
    {
      accessorKey: "separatedKitchenLiving",
      header: "Раздельная кухня и гостинная",
      cell: ({ row }) => {
        const id = `is-default-${row.id}`;

        return (
          <Switch
            id={id}
            checked={row.original.separatedKitchenLiving}
            disabled
          />
        );
      },
    },
    {
      accessorKey: "bathroom",
      header: "Количество сан. узлов",
      cell: ({ row }) => mappers.bathroomCountMapper[row.original.bathroom],
    },
    {
      accessorKey: "facingMaterial",
      header: "Материал облицовки",
      cell: ({ row }) => {
        if (!row.original?.facingMaterial) {
          return "Не выбран";
        }

        return mappers.facingMaterialMapper[row.original.facingMaterial];
      },
    },
    {
      accessorKey: "wallMaterial",
      header: "Материал стен",
      cell: ({ row }) => mappers.wallMaterialMapper[row.original.wallMaterial],
    },
    {
      accessorKey: "insulation",
      header: "Утеплитель",
      cell: ({ row }) => {
        if (!row.original?.insulation) {
          return "Не выбран";
        }

        return mappers.insulationMapper[row.original.insulation];
      },
    },
    {
      accessorKey: "hasMinimumDownPayment",
      header: "Дом без первоначального взноса?",
      cell: ({ row }) => {
        const id = `is-default-${row.id}`;

        return (
          <Switch
            id={id}
            checked={row.original.separatedKitchenLiving}
            disabled
          />
        );
      },
    },
    {
      accessorKey: "houseStatus",
      header: "Статус объекта",
      cell: ({ row }) => mappers.statusMapper[row.original.houseStatus],
    },
    {
      accessorKey: "saleStatus",
      header: "Статус продажи объекта",
      cell: ({ row }) => mappers.saleMapper[row.original.saleStatus],
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
      cell: ({ row }) => {
        if (!dictionaries?.developers) {
          return row.original.developerId;
        }

        return (
          dictionaries.developers.find(
            ({ id }) => id === row.original.developerId,
          )?.title ?? "Застройщик не найден"
        );
      },
    },
    {
      accessorKey: "cadastralNumber",
      header: "Кадастровый номер",
    },
    {
      accessorKey: "phones",
      header: "Телефоны",
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            {row.original.phones.map(({ id, phone }) => (
              <Badge key={id}>{phone.label}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "messengers",
      header: "Мессенджеры",
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            {row.original.messengers.map(({ id, messenger }) => (
              <Badge key={id}>{messenger.label}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "yandexDiskLink",
      header: "Ссылка на яндекс диск",
      cell: ({ row }) => {
        const link = row.original.yandexDiskLink;

        if (!link) {
          return null;
        }

        return (
          <div className="max-w-60 overflow-hidden text-ellipsis">
            <a
              href={link}
              target="_blank"
              className="font-medium text-fg-brand underline hover:no-underline"
            >
              {link}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "gallery",
      header: "Изображения",
      cell: ({ row }) => {
        const urls = row.original.gallery.slice(0, 3);

        return (
          <div className="flex gap-1 w-50">
            {urls.map((url) => (
              <Image
                key={url}
                src={url}
                width={64}
                height={64}
                alt={`img-${url}`}
                className="object-cover rounded-sm"
              />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "layout",
      header: "Планировка",
      cell: ({ row }) => {
        const url = row.original.layout;

        if (!url) {
          return null;
        }

        return (
          <div className="flex gap-1 w-16">
            <Image
              key={url}
              src={url}
              width={64}
              height={64}
              alt={`img-${url}`}
              className="object-cover rounded-sm"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "_actions",
      header: "",
      size: 80,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2 sticky right-0">
            <Link href={`/houses/${row.original.id}`} target="_blank">
              <Button variant="outline" size="icon" disabled={isPending}>
                <Eye className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Смотреть</span>
              </Button>
            </Link>

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
    initialState: {
      columnPinning: {
        left: ["name"],
        right: ["_actions"],
      },
    },
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
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;

                  return (
                    <TableHead
                      key={header.id}
                      className="bg-background"
                      style={{ ...getCommonPinningStyles(column) }}
                    >
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
                    <TableCell
                      key={cell.id}
                      className="bg-background"
                      style={{ ...getCommonPinningStyles(cell.column) }}
                    >
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
        <DialogContent
          className="max-w-140 overflow-y-auto p-0"
          style={{ maxHeight: "90vh" }}
        >
          {creatingValues && (
            <HouseForm
              formTitle="Новый объект"
              house={creatingValues}
              isPending={isPending}
              error={createState}
              onCancel={() => {
                setIsCreateMode(false);
              }}
              onSave={handleCreate}
              dictionaries={dictionaries}
              phones={phones}
              messengers={messengers}
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
        <DialogContent
          className="max-w-140 overflow-y-auto p-0"
          style={{ maxHeight: "90vh" }}
        >
          {editingValues && (
            <HouseForm
              formTitle="Редактировать"
              house={editingValues}
              isPending={isPending}
              error={updateState}
              onCancel={handleCancelEdit}
              onSave={handleSaveEdit}
              dictionaries={dictionaries}
              phones={phones}
              messengers={messengers}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
