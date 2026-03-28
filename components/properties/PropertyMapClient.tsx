"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse"></div>,
});

export default function PropertyMapClient({ lat, lng, title }: { lat: number; lng: number; title?: string }) {
  return <PropertyMap lat={lat} lng={lng} title={title} />;
}
