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
import { Messenger } from "@/lib/generated/prisma/client";
import { FC, useActionState, useEffect, useTransition } from "react";
import {
  createMessenger,
  deleteMessenger,
  updateMessenger,
} from "@/app/actions/messenger";
import { FieldDescription } from "@/components/ui/field";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessengerCreateInput } from "@/lib/generated/prisma/models/Messenger";
import { MessengerForm } from "./form";
import { Switch } from "@/components/ui/switch";

const defaultCreateState: MessengerCreateInput = {
  link: "",
  label: "",
  isDefault: false,
};
const createInitialState = { error: "", success: false };
const updateInitialState = { error: "", success: false };
const deleteInitialState = { error: "" };

interface Props {
  messengers: Messenger[];
}

export const MessengersTable: FC<Props> = ({ messengers }) => {
  const [isPending, startTransition] = useTransition();

  const [createState, createFormAction] = useActionState(
    createMessenger,
    createInitialState,
  );
  const [updateState, updateFormAction] = useActionState(
    updateMessenger,
    updateInitialState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteMessenger,
    deleteInitialState,
  );

  const [isCreateMode, setIsCreateMode] = React.useState(false);
  const [creatingValues, setCreatingValues] =
    React.useState<MessengerCreateInput>(defaultCreateState);
  const handleCreate = async (data: MessengerCreateInput) => {
    startTransition(async () => {
      createFormAction(data);
    });
  };

  const [editingValues, setEditingValues] = React.useState<Messenger | null>(
    null,
  );
  const handleEdit = (messenger: Messenger) => {
    setEditingValues(messenger);
  };
  const handleCancelEdit = () => {
    setEditingValues(null);
  };
  const handleSaveEdit = async (messenger: MessengerCreateInput) => {
    startTransition(async () => {
      updateFormAction(messenger);
    });
  };

  const handleDelete = async (messengerId: string) => {
    startTransition(async () => {
      deleteFormAction(messengerId);
    });
  };

  const columns: ColumnDef<Messenger>[] = [
    {
      accessorKey: "link",
      header: "Ссылка",
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
    data: messengers,
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
        <h3 className="text-xl font-semibold">Мессенджеры</h3>
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
            <MessengerForm
              formTitle="Новый мессенджер"
              messenger={creatingValues}
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
        <DialogContent className="sm:max-w-[425px]">
          {editingValues && (
            <MessengerForm
              formTitle="Редактировать"
              messenger={editingValues}
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
