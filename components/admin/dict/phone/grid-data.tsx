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

import { FC, useActionState, useEffect, useTransition } from "react";
import { createPhone, deletePhone, updatePhone } from "@/app/actions/phone";
import { FieldDescription } from "@/components/ui/field";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { PhoneForm } from "./form";
import { Switch } from "@/components/ui/switch";
import { Phone, Prisma } from "@prisma/client";
import PhoneCreateInput = Prisma.PhoneCreateInput;

const defaultCreateState: PhoneCreateInput = {
  phone: "",
  label: "",
  isDefault: false,
};
const createInitialState = { error: "", success: false };
const updateInitialState = { error: "", success: false };
const deleteInitialState = { error: "" };

interface Props {
  phones: Phone[];
}

export const PhonesTable: FC<Props> = ({ phones }) => {
  const [isPending, startTransition] = useTransition();

  const [createState, createFormAction] = useActionState(
    createPhone,
    createInitialState,
  );
  const [updateState, updateFormAction] = useActionState(
    updatePhone,
    updateInitialState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deletePhone,
    deleteInitialState,
  );

  const [isCreateMode, setIsCreateMode] = React.useState(false);
  const [creatingValues, setCreatingValues] =
    React.useState<PhoneCreateInput>(defaultCreateState);
  const handleCreate = async (data: PhoneCreateInput) => {
    startTransition(async () => {
      createFormAction(data);
    });
  };

  const [editingValues, setEditingValues] = React.useState<Phone | null>(null);
  const handleEdit = (phone: Phone) => {
    setEditingValues(phone);
  };
  const handleCancelEdit = () => {
    setEditingValues(null);
  };
  const handleSaveEdit = async (phone: PhoneCreateInput) => {
    startTransition(async () => {
      updateFormAction(phone);
    });
  };

  const handleDelete = async (phoneId: string) => {
    startTransition(async () => {
      deleteFormAction(phoneId);
    });
  };

  const columns: ColumnDef<Phone>[] = [
    {
      accessorKey: "phone",
      header: "Номер",
    },
    {
      accessorKey: "label",
      header: "Описание",
    },
    {
      accessorKey: "isDefault",
      header: "По умолчанию",
      cell: ({ row }) => {
        const id = `is-default-${row.id}`;

        return <Switch id={id} checked={row.original.isDefault} disabled />;
      },
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
                await handleDelete(row.original.id);
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
    data: phones,
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
        <h3 className="text-xl font-semibold">Телефоны</h3>
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

      <div
        className="overflow-y-scroll rounded-md border"
        style={{
          maxHeight: "calc(100vh - 220px)",
        }}
      >
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
          className="max-w-110 overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          {creatingValues && (
            <PhoneForm
              formTitle="Новый телефон"
              phone={creatingValues}
              isPending={isPending}
              errorMessage={createState?.error}
              onCancel={handleCancelEdit}
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
        <DialogContent
          className="max-w-110 overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          {editingValues && (
            <PhoneForm
              formTitle="Редактировать"
              phone={editingValues}
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
