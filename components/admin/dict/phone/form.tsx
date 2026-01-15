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
import { PhoneCreateInput } from "@/lib/generated/prisma/models/Phone";
import { Switch } from "@/components/ui/switch";

interface Props {
  formTitle: string;
  phone: PhoneCreateInput;
  isPending?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onSave: (data: PhoneCreateInput) => void;
}

export const PhoneForm: FC<Props> = ({
  formTitle,
  phone,
  isPending = false,
  errorMessage = "",
  onCancel,
  onSave,
}) => {
  const [state, setState] = useState<PhoneCreateInput>(phone);

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
          <Label>Номер</Label>
          <Input
            value={state.phone}
            onChange={(event) => {
              setState(
                (prev): PhoneCreateInput => ({
                  ...prev,
                  phone: event.target.value,
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
                (prev): PhoneCreateInput => ({
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
                (prev): PhoneCreateInput => ({
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
