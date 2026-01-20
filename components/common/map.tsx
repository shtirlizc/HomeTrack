"use client";
import * as React from "react";
import * as ReactDOM from "react-dom";
import type { ReactifiedModule } from "@yandex/ymaps3-types/reactify";

type Coordinates = [number, number];

interface Props {
  initCoordinates: Coordinates;
  onAddPoint: (coords: Coordinates) => void;
}

export const Map = ({ initCoordinates, onAddPoint }: Props) => {
  const [reactifiedApi, setReactifiedApi] =
    React.useState<ReactifiedModule<typeof ymaps3>>();

  React.useEffect(() => {
    Promise.all([ymaps3.import("@yandex/ymaps3-reactify"), ymaps3.ready]).then(
      ([{ reactify }]) =>
        setReactifiedApi(reactify.bindTo(React, ReactDOM).module(ymaps3)),
    );
  }, []);

  if (!reactifiedApi) {
    return null;
  }

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } =
    reactifiedApi;

  return (
    <div style={{ width: "100%", aspectRatio: "2 / 1.5" }}>
      <YMap location={{ center: initCoordinates, zoom: 9 }}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
      </YMap>
    </div>
  );
};
