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
import { SelectField } from "@/components/admin/houses/select-field";
import { Developer, District, Phone } from "@/lib/generated/prisma/client";
import {
  BathroomCount,
  BedroomCount,
  FacingMaterial,
  Finishing,
  FloorCount,
  Heating,
  HouseStatus,
  HouseType,
  Insulation,
  LandCategory,
  mappers,
  SaleStatus,
  WallMaterial,
} from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Coordinates, Map } from "@/components/common/map";
import { MarkdownEditor } from "@/components/common/markdown-editor";
import MultipleSelector from "@/components/ui/multi-select";
import { IncludedHouse } from "@/app/actions/houses";

import { makeIncludedHousePhone } from "./utils";

const INIT_COORDS: Coordinates = [56.10962394067204, 54.62695042147847];

export interface Dictionaries {
  districts: District[];
  developers: Developer[];
}

const ErrorMessage: FC<{ message?: string }> = ({ message }) => {
  return (
    <FieldDescription className="text-red-500">{message}</FieldDescription>
  );
};

interface Props {
  formTitle: string;
  house: IncludedHouse;
  isPending?: boolean;
  error: { error?: string; success?: false; fieldName?: string };
  onCancel: () => void;
  onSave: (data: IncludedHouse) => void;
  dictionaries: Dictionaries;
  phones: Phone[];
}

const makeOptionItem = ({ id, label }: Phone) => ({ value: id, label });

export const HouseForm: FC<Props> = ({
  formTitle,
  house,
  isPending = false,
  error = {},
  onCancel,
  onSave,
  dictionaries,
  phones,
}) => {
  const phoneOptions = phones.map(makeOptionItem);

  const [state, setState] = useState<IncludedHouse>(house);

  const startCoords: Coordinates =
    !state.latitude && !state.longitude
      ? INIT_COORDS
      : [state.latitude, state.longitude];

  const handleSave = () => {
    onSave(state);
  };

  const hasError = error?.error || false;

  return (
    <form action={handleSave} className="flex flex-col gap-6 pt-6">
      <DialogHeader className="px-6">
        <DialogTitle>{formTitle}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 px-6">
        {state.id && (
          <Input type="hidden" value={state.id} onChange={() => {}} />
        )}

        <div className="grid gap-3">
          <Label>Название объекта</Label>
          <Input
            placeholder="Название объекта"
            className={`${hasError && error?.fieldName === "name" && "border-red-500"}`}
            value={state.name}
            onChange={(event) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  name: event.target.value,
                }),
              );
            }}
          />
          {hasError && error?.fieldName === "name" && (
            <ErrorMessage message={error.error} />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-default"
            checked={state.isActive}
            onCheckedChange={(checked) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  isActive: checked,
                }),
              );
            }}
          />
          <Label htmlFor="is-default">Показывать покупателям</Label>
        </div>

        <div className="grid gap-3">
          <Label>Описание</Label>
          <MarkdownEditor
            initialMd={state?.description}
            onChange={(md) => {
              setState((prev) => ({
                ...prev,
                description: md,
              }));
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Район</Label>
          <SelectField
            list={
              dictionaries.districts?.map(({ id, title }) => {
                return { id, name: title };
              }) ?? []
            }
            value={state.districtId}
            onChange={(districtId: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  districtId,
                }),
              );
            }}
            error={(hasError && error?.fieldName === "districtId") || false}
          />
          {hasError && error?.fieldName === "districtId" && (
            <ErrorMessage message={error.error} />
          )}
        </div>

        <div className="grid gap-3">
          <Label>Застройщик</Label>
          <SelectField
            list={
              dictionaries.developers?.map(({ id, title }) => {
                return { id, name: title };
              }) ?? []
            }
            value={state.developerId}
            onChange={(developerId: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  developerId,
                }),
              );
            }}
            error={(hasError && error?.fieldName === "developerId") || false}
          />
          {hasError && error?.fieldName === "developerId" && (
            <ErrorMessage message={error.error} />
          )}
        </div>

        <div className="grid gap-3">
          <Label>Место нахождения</Label>
          <Map
            initCoordinates={startCoords}
            onAddPoint={(coords) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  latitude: coords.at(0) ?? 0,
                  longitude: coords.at(1) ?? 0,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Вид объекта</Label>
          <SelectField
            list={Object.entries(mappers.typeMapper).map(([key, value]) => {
              return { id: key, name: value };
            })}
            value={state.type}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  type: type as HouseType,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Цена</Label>
          <Input
            type="number"
            value={state.price}
            onChange={(event) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  price: Number(event.target.value),
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Площадь дома</Label>
          <Input
            type="number"
            value={state.houseArea}
            onChange={(event) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  houseArea: Number(event.target.value),
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Площадь участка</Label>
          <Input
            type="number"
            value={state.plotArea}
            onChange={(event) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  plotArea: Number(event.target.value),
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Категория земли</Label>
          <SelectField
            list={Object.entries(mappers.landCategoryMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state.landCategory}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  landCategory: type as LandCategory,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Отделка</Label>
          <SelectField
            list={Object.entries(mappers.finishingMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state.finishing}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  finishing: type as Finishing,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Отопление</Label>
          <SelectField
            list={Object.entries(mappers.heatingMapper).map(([key, value]) => {
              return { id: key, name: value };
            })}
            value={state.heating}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  heating: type as Heating,
                }),
              );
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-default"
            checked={state?.asphaltToHouse}
            onCheckedChange={(checked) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  asphaltToHouse: checked,
                }),
              );
            }}
          />
          <Label htmlFor="is-default">Асфальт до дома</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-default"
            checked={state?.closedComplex}
            onCheckedChange={(checked) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  closedComplex: checked,
                }),
              );
            }}
          />
          <Label htmlFor="is-default">Закрытый ЖК</Label>
        </div>

        <div className="grid gap-3">
          <Label>Количество этажей</Label>
          <SelectField
            list={Object.entries(mappers.floorCountMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state.floor}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  floor: type as FloorCount,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Количество спален</Label>
          <SelectField
            list={Object.entries(mappers.bedroomCountMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state.floor}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  bedroom: type as BedroomCount,
                }),
              );
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-default"
            checked={state?.separatedKitchenLiving}
            onCheckedChange={(checked) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  separatedKitchenLiving: checked,
                }),
              );
            }}
          />
          <Label htmlFor="is-default">Раздельная кухня и гостинная</Label>
        </div>

        <div className="grid gap-3">
          <Label>Количество сан. узлов</Label>
          <SelectField
            list={Object.entries(mappers.bathroomCountMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state.floor}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  bathroom: type as BathroomCount,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Материал облицовки</Label>
          <SelectField
            list={Object.entries(mappers.facingMaterialMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state?.facingMaterial ?? ""}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  facingMaterial: type as FacingMaterial,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Материал стен</Label>
          <SelectField
            list={Object.entries(mappers.wallMaterialMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state.wallMaterial}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  wallMaterial: type as WallMaterial,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Утеплитель</Label>
          <SelectField
            list={Object.entries(mappers.insulationMapper).map(
              ([key, value]) => {
                return { id: key, name: value };
              },
            )}
            value={state?.insulation ?? ""}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  insulation: type as Insulation,
                }),
              );
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-default"
            checked={state?.hasMinimumDownPayment}
            onCheckedChange={(checked) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  hasMinimumDownPayment: checked,
                }),
              );
            }}
          />
          <Label htmlFor="is-default">Без первоначального взноса?</Label>
        </div>

        <div className="grid gap-3">
          <Label>Статус объекта</Label>
          <SelectField
            list={Object.entries(mappers.statusMapper).map(([key, value]) => {
              return { id: key, name: value };
            })}
            value={state.houseStatus}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  houseStatus: type as HouseStatus,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Статус продажи объекта</Label>
          <SelectField
            list={Object.entries(mappers.saleMapper).map(([key, value]) => {
              return { id: key, name: value };
            })}
            value={state.saleStatus}
            onChange={(type: string) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  saleStatus: type as SaleStatus,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Телефоны</Label>
          <MultipleSelector
            value={state.phones.map(({ phone }) => {
              return { value: phone.id, label: phone.label };
            })}
            defaultOptions={phoneOptions}
            placeholder="Выбери телефоны"
            onChange={(event) => {
              setState((prev) => {
                const selectedPhones = phones.filter(({ id }) =>
                  event.some(({ value }) => value === id),
                );

                return {
                  ...prev,
                  phones: selectedPhones.map(makeIncludedHousePhone),
                };
              });
            }}
            hideClearAllButton
            hidePlaceholderWhenSelected
            className="w-full"
            emptyIndicator={
              <p className="text-center text-sm">Результатов не найдено</p>
            }
          />
        </div>

        <div className="grid gap-3">
          <Label>Кадастровый номер</Label>
          <Input
            placeholder="Кадастровый номер"
            value={state?.cadastralNumber ?? ""}
            onChange={(event) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  cadastralNumber: event.target.value,
                }),
              );
            }}
          />
        </div>

        <div className="grid gap-3">
          <Label>Ссылка на яндекс диск</Label>
          <Input
            placeholder="Ссылка на яндекс диск"
            value={state?.yandexDiskLink ?? ""}
            onChange={(event) => {
              setState(
                (prev): IncludedHouse => ({
                  ...prev,
                  yandexDiskLink: event.target.value,
                }),
              );
            }}
          />
        </div>
      </div>

      <DialogFooter className="px-6 pb-6 bg-background sticky bottom-0">
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
