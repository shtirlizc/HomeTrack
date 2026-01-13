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
import { addDistrict } from "@/app/actions/districts";
import { FieldDescription } from "@/components/ui/field";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialState = { error: "", success: false };

interface Props {
  districts: District[];
}

export const DistrictsTable: FC<Props> = ({ districts }) => {
  const [state, formAction] = useActionState(addDistrict, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const handleEdit = (rowId: string) => {
    console.log("#### edit", rowId);
  };

  const handleDelete = (rowId: string) => {
    console.log("#### delete", rowId);
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
                handleEdit(row.id);
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
