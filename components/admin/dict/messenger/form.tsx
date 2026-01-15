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
import { MessengerCreateInput } from "@/lib/generated/prisma/models/Messenger";
import { Switch } from "@/components/ui/switch";

interface Props {
  formTitle: string;
  messenger: MessengerCreateInput;
  isPending?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onSave: (data: MessengerCreateInput) => void;
}

export const MessengerForm: FC<Props> = ({
  formTitle,
  messenger,
  isPending = false,
  errorMessage = "",
  onCancel,
  onSave,
}) => {
  const [state, setState] = useState<MessengerCreateInput>(messenger);

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
          <Label>Ссылка</Label>
          <Input
            value={state.link}
            onChange={(event) => {
              setState(
                (prev): MessengerCreateInput => ({
                  ...prev,
                  link: event.target.value,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Описание</Label>
          <Input
            value={state.label}
            onChange={(event) => {
              setState(
                (prev): MessengerCreateInput => ({
                  ...prev,
                  label: event.target.value,
                }),
              );
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-default"
            checked={state?.isDefault}
            onCheckedChange={(checked) => {
              setState(
                (prev): MessengerCreateInput => ({
                  ...prev,
                  isDefault: checked,
                }),
              );
            }}
          />
          <Label htmlFor="is-default">Использовать по умолчанию</Label>
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
