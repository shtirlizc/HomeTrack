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
  error?: boolean;
}

export const SelectField: FC<Props> = ({
  list,
  value,
  onChange,
  error = false,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full ${error && "border-red-500"}`}>
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
