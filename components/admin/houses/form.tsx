"use client";

import { ChangeEvent, FC, useRef, useState, useTransition } from "react";
import Image from "next/image";
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
import { Developer, District, Messenger, Phone } from "@prisma/client";
import { SelectField } from "@/components/admin/houses/select-field";
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
import { uploadImage } from "@/app/lib/storage/client";
import { XCircle, Check } from "lucide-react";

import {
  convertBlobUrlToFile,
  makeIncludedHouseMessenger,
  makeIncludedHousePhone,
} from "./utils";

type ImageLoadedType = {
  url: string;
  isLoaded: boolean;
};

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
  messengers: Messenger[];
}

const makeOptionItem = ({ id, label }: Phone | Messenger) => ({
  value: id,
  label,
});

export const HouseForm: FC<Props> = ({
  formTitle,
  house,
  isPending = false,
  error = {},
  onCancel,
  onSave,
  dictionaries,
  phones,
  messengers,
}) => {
  const phoneOptions = phones.map(makeOptionItem);
  const messengerOptions = messengers.map(makeOptionItem);

  const [state, setState] = useState<IncludedHouse>(house);

  const galleryRef = useRef<HTMLInputElement>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setGalleryUrls((prev) => [...prev, ...newImageUrls]);
    }
  };
  const [isGalleryPending, startGalleryTransition] = useTransition();
  const handleUploadGallery = () => {
    startGalleryTransition(async () => {
      const urls: string[] = [];
      for (const url of galleryUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "gallery",
        });

        if (error) {
          console.error(error);
          return;
        }

        urls.push(imageUrl);
      }

      setState((prev) => ({ ...prev, gallery: urls }));
      setGalleryUrls([]);
    });
  };

  const layoutRef = useRef<HTMLInputElement>(null);
  const [layoutUrl, setLayoutUrl] = useState<ImageLoadedType>({
    url: state.layout ?? "",
    isLoaded: true,
  });
  const handleLayoutChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setLayoutUrl({ url: newImageUrls.at(0) ?? "", isLoaded: false });
    }
  };
  const [isLayoutPending, startLayoutTransition] = useTransition();
  const handleUploadLayout = () => {
    startLayoutTransition(async () => {
      let savedUrl: string = "";
      const imageFile = await convertBlobUrlToFile(layoutUrl.url);

      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "gallery",
      });

      if (error) {
        console.error(error);
        return;
      }

      savedUrl = imageUrl;

      setState((prev) => ({ ...prev, layout: savedUrl }));
      setLayoutUrl((prev) => ({ ...prev, isLoaded: true }));
    });
  };

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
            isEditable
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
            value={state.bedroom}
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
            value={state.bathroom}
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
          <Label>Мессенджеры</Label>
          <MultipleSelector
            value={state.messengers.map(({ messenger }) => {
              return { value: messenger.id, label: messenger.label };
            })}
            defaultOptions={messengerOptions}
            placeholder="Выбери мессенджеры"
            onChange={(event) => {
              setState((prev) => {
                const selectedMessengers = messengers.filter(({ id }) =>
                  event.some(({ value }) => value === id),
                );

                return {
                  ...prev,
                  messengers: selectedMessengers.map(
                    makeIncludedHouseMessenger,
                  ),
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

        <div className="grid gap-3">
          <Label>Фотографии</Label>
          <Input
            ref={galleryRef}
            type="file"
            multiple
            hidden
            onChange={handleGalleryChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => galleryRef.current?.click()}
            disabled={isGalleryPending}
          >
            Выбрать фотографии
          </Button>
          {galleryUrls.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {galleryUrls.map((url) => (
                <Image
                  key={url}
                  src={url}
                  width={80}
                  height={80}
                  alt={`img-${url}`}
                  className="object-cover rounded-md"
                />
              ))}
            </div>
          )}
          <Button
            type="button"
            onClick={handleUploadGallery}
            disabled={galleryUrls.length === 0 || isGalleryPending}
          >
            {isGalleryPending && <Spinner />}
            {isGalleryPending ? "Загрузка" : "Загрузить фотографии"}
          </Button>
        </div>

        <div className="grid gap-3">
          <Label>Планировка</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              ref={layoutRef}
              type="file"
              hidden
              onChange={handleLayoutChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => layoutRef.current?.click()}
              disabled={isLayoutPending}
            >
              Выбрать планировку
            </Button>
            <Button
              type="button"
              onClick={handleUploadLayout}
              disabled={!layoutUrl.url || isLayoutPending}
            >
              {isLayoutPending && <Spinner />}
              {isLayoutPending ? "Загрузка" : "Загрузить планировку"}
            </Button>
          </div>

          {layoutUrl.url && (
            <div className="flex flex-wrap justify-center gap-2">
              <Image
                key={layoutUrl.url}
                src={layoutUrl.url}
                width={80}
                height={80}
                alt={`img-${layoutUrl.url}`}
                className="object-cover rounded-md"
              />
              <div className="flex flex-col gap-1">
                <XCircle
                  className="h-[1.2rem] w-[1.2rem] cursor-pointer hover:text-primary transition-text duration-200"
                  onClick={() => {
                    setLayoutUrl({ url: "", isLoaded: false });
                  }}
                />
                {layoutUrl.isLoaded && (
                  <Check className="h-[1.2rem] w-[1.2rem] text-green-500" />
                )}
              </div>
            </div>
          )}
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
