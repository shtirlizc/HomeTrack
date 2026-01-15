"use client";

import { FC, useState } from "react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import * as React from "react";
import { DeveloperCreateInput } from "@/lib/generated/prisma/models/Developer";

interface Props {
  formTitle: string;
  developer: DeveloperCreateInput;
  isPending?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onSave: (data: DeveloperCreateInput) => void;
}

export const DeveloperForm: FC<Props> = ({
  formTitle,
  developer,
  isPending = false,
  errorMessage = "",
  onCancel,
  onSave,
}) => {
  const [state, setState] = useState<DeveloperCreateInput>(developer);

  const handleSave = () => {
    onSave(state);
  };

  return (
    <form action={handleSave} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{formTitle}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        {state.id && (
          <Input type="hidden" value={state.id} onChange={() => {}} />
        )}

        <div className="grid gap-3">
          <Label>Название</Label>
          <Input
            value={state.title}
            onChange={(event) => {
              setState(
                (prev): DeveloperCreateInput => ({
                  ...prev,
                  title: event.target.value,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Ссылка</Label>
          <Input
            value={state?.link || ""}
            onChange={(event) => {
              setState(
                (prev): DeveloperCreateInput => ({
                  ...prev,
                  link: event.target.value,
                }),
              );
            }}
          />
        </div>

        {errorMessage && (
          <FieldDescription className="text-center text-red-500">
            {errorMessage}
          </FieldDescription>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending} onClick={onCancel}>
            Отмена
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Сохранить
        </Button>
      </DialogFooter>
    </form>
  );
};
