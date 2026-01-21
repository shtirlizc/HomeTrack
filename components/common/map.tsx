"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import type { ReactifiedModule } from "@yandex/ymaps3-types/reactify";
import { Reactify } from "@yandex/ymaps3-types/reactify/reactify";

export type Coordinates = [number, number];

interface Props {
  initCoordinates: Coordinates;
  onAddPoint: (coords: Coordinates) => void;
}

export const Map = ({ initCoordinates, onAddPoint }: Props) => {
  const [reactify, setReactify] = React.useState<Reactify | null>(null);
  const [reactifiedApi, setReactifiedApi] =
    React.useState<ReactifiedModule<typeof ymaps3>>();
  const [uiReactified, setUiReactified] = React.useState<any>(null);

  const [marker, setMarker] = React.useState<Coordinates>(initCoordinates);

  React.useEffect(() => {
    Promise.all([ymaps3.import("@yandex/ymaps3-reactify"), ymaps3.ready]).then(
      ([{ reactify: rawReactify }]) => {
        const boundReactify = rawReactify.bindTo(React, ReactDOM);
        setReactify(boundReactify);
        setReactifiedApi(boundReactify.module(ymaps3));

        import("@yandex/ymaps3-default-ui-theme").then((uiPkg) => {
          setUiReactified(boundReactify.module(uiPkg));
        });
      },
    );
  }, []);

  React.useEffect(() => {
    onAddPoint(marker);
  }, [marker]);

  if (!reactifiedApi || !reactify || !uiReactified) {
    return null;
  }

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapListener,
    YMapMarker,
    YMapControls,
  } = reactifiedApi;
  const { YMapZoomControl } = uiReactified;

  return (
    <div style={{ width: "100%", aspectRatio: "2 / 1.5" }}>
      <YMap
        location={reactify.useDefault({ center: initCoordinates, zoom: 10 })}
      >
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        <YMapControls position="right">
          <YMapZoomControl />
        </YMapControls>

        <YMapListener
          layer="any"
          onClick={(_, event) => {
            const coords = event.coordinates as Coordinates;
            setMarker(coords);
          }}
        />
        <YMapMarker coordinates={marker}>
          <div className="border-primary border-4 w-5 h-5 rounded-full" />
        </YMapMarker>
      </YMap>
    </div>
  );
};
