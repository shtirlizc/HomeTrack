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
import { District } from "@/lib/generated/prisma/client";
import { FC, useActionState, useEffect, useRef } from "react";
import {
  addDistrict,
  deleteDistrict,
  updateDistrict,
} from "@/app/actions/districts";
import { FieldDescription } from "@/components/ui/field";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DistrictCreateInput } from "@/lib/generated/prisma/models/District";

const defaultCreateState = { title: "", description: "" };
const createInitialState = { error: "", success: false };
const updateInitialState = { error: "", success: false };
const deleteInitialState = { error: "" };

interface Props {
  districts: District[];
}

export const DistrictsTable: FC<Props> = ({ districts }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [createState, createFormAction] = useActionState(
    addDistrict,
    createInitialState,
  );
  const [updateState, updateFormAction] = useActionState(
    updateDistrict,
    updateInitialState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteDistrict,
    deleteInitialState,
  );

  const [isCreateMode, setIsCreateMode] = React.useState(false);
  const [creatingValues, setCreatingValues] =
    React.useState<DistrictCreateInput>(defaultCreateState);

  const [editingValues, setEditingValues] = React.useState<District | null>(
    null,
  );

  const handleEdit = (district: District) => {
    setEditingValues(district);
  };
  const handleCancelEdit = () => {
    setEditingValues(null);
  };
  const handleSaveEdit = async (formData: FormData) => {
    updateFormAction(formData);
  };

  const columns: ColumnDef<District>[] = [
    {
      accessorKey: "title",
      header: "Название",
    },
    {
      accessorKey: "description",
      header: "Описание",
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
              className="cursor-pointer"
              onClick={() => {
                handleEdit(row.original);
              }}
            >
              <Edit className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Отредактировать</span>
            </Button>

            <form action={deleteFormAction}>
              <Input
                type="hidden"
                name="id"
                value={row.original.id}
                onChange={() => {}}
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="cursor-pointer text-red-500"
              >
                <Trash2 className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Удалить</span>
              </Button>
            </form>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data: districts,
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
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-xl font-semibold">Районы</h3>
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
                  No results.
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
          <form
            ref={formRef}
            action={createFormAction}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Новый район</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Название</Label>
                <Input
                  name="title"
                  value={creatingValues.title}
                  onChange={(event) => {
                    setCreatingValues((prev): DistrictCreateInput => {
                      return { ...prev, title: event.target.value };
                    });
                  }}
                />
              </div>
              <div className="grid gap-3">
                <Label>Описание</Label>
                <Input
                  name="description"
                  value={creatingValues?.description || ""}
                  onChange={(event) => {
                    setCreatingValues((prev): DistrictCreateInput => {
                      return { ...prev, description: event.target.value };
                    });
                  }}
                />
              </div>
              {createState?.error && (
                <FieldDescription className="text-center text-red-500">
                  {createState.error}
                </FieldDescription>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Отмена
                </Button>
              </DialogClose>
              <Button type="submit">Создать</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingValues)}
        onOpenChange={() => {
          setEditingValues(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <form action={handleSaveEdit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Редактировать</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <Input
                name="id"
                type="hidden"
                value={editingValues?.id || ""}
                onChange={() => {}}
              />
              <div className="grid gap-3">
                <Label>Название</Label>
                <Input
                  name="title"
                  value={editingValues?.title || ""}
                  onChange={(event) => {
                    setEditingValues((prev): District | null => {
                      if (!prev) return null;
                      return { ...prev, title: event.target.value };
                    });
                  }}
                />
              </div>
              <div className="grid gap-3">
                <Label>Описание</Label>
                <Input
                  name="description"
                  value={editingValues?.description || ""}
                  onChange={(event) => {
                    setEditingValues((prev): District | null => {
                      if (!prev) return null;
                      return { ...prev, description: event.target.value };
                    });
                  }}
                />
              </div>
              {updateState?.error && (
                <FieldDescription className="text-center text-red-500">
                  {updateState.error}
                </FieldDescription>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Отмена
                </Button>
              </DialogClose>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
