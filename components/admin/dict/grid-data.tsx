"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { addDistrict, updateDistrict } from "@/app/actions/districts";
import { FieldDescription } from "@/components/ui/field";
import { Edit, Trash2, Save, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { error: "", success: false };

interface Props {
  districts: District[];
}

export const DistrictsTable: FC<Props> = ({ districts }) => {
  const [state, formAction] = useActionState(addDistrict, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingValues, setEditingValues] = React.useState<District | null>(
    null,
  );

  const handleEdit = (district: District) => {
    setEditingId(district.id);
    setEditingValues(district);
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValues(null);
  };
  const handleSaveEdit = async () => {
    if (!editingValues) {
      console.error("EditingValues is empty");
      return null;
    }

    await updateDistrict(editingValues);
    handleCancelEdit();
  };

  const handleDelete = (rowId: string) => {
    console.log("#### delete", rowId);
  };

  const columns: ColumnDef<District>[] = [
    {
      accessorKey: "title",
      header: "Название",
      cell: ({ row }) => {
        const original = row.original;
        const isEditing = editingId === original.id;

        if (!isEditing || !editingValues) return original.title;

        return (
          <Input
            value={editingValues.title ?? ""}
            onChange={(event) =>
              setEditingValues((prev) => {
                if (!prev) return null;

                return { ...prev, title: event.target.value };
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "description",
      header: "Описание",
      cell: ({ row }) => {
        const original = row.original;
        const isEditing = editingId === original.id;

        if (!isEditing || !editingValues) return original.description;

        return (
          <Input
            value={editingValues.description ?? ""}
            onChange={(event) =>
              setEditingValues((prev): District | null => {
                if (!prev) return null;

                return { ...prev, description: event.target.value };
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "_actions",
      header: "",
      size: 80,
      cell: ({ row }) => {
        const original = row.original;
        const isEditing = editingId === original.id;

        if (!isEditing) {
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
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer text-red-500"
                onClick={() => {
                  handleDelete(row.original.id);
                }}
              >
                <Trash2 className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Удалить</span>
              </Button>
            </div>
          );
        }

        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => {
                handleCancelEdit();
              }}
            >
              <Undo className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Отмена</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer "
              onClick={() => {
                handleSaveEdit();
              }}
            >
              <Save className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Сохранить</span>
            </Button>
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data: districts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="w-full">
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

      <form ref={formRef} action={formAction}>
        <input type="text" name="title" style={{ border: "2px dashed red" }} />
        <button type="submit">send</button>
        {state.error && (
          <FieldDescription className="text-center text-red-500">
            {state.error}
          </FieldDescription>
        )}
      </form>
    </div>
  );
};
