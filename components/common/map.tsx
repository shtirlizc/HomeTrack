"use client";

type Coordinates = { lat: number; lng: number };

interface Props {
  initCoordinates: Coordinates;
  onAddPoint: (coords: Coordinates) => void;
}

export const MapPage = ({ initCoordinates, onAddPoint }: Props) => {
  return null;
};
