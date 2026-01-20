import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";

interface Props {
  list: Array<{ name: string; id: string }>;
  value: string;
  onChange: (value: string) => void;
}

export const SelectField: FC<Props> = ({ list, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выберите район" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {list.map(({ id, name }) => (
            <SelectItem key={id} value={id}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
