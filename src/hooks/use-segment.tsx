import { useEffect, useState, useCallback } from "react";

export type Segment = "importer" | "treasury";

const KEY = "canta.segment";

const read = (): Segment => {
  if (typeof window === "undefined") return "treasury";
  const v = window.localStorage.getItem(KEY);
  return v === "importer" || v === "treasury" ? v : "treasury";
};

export const useSegment = () => {
  const [segment, setSegmentState] = useState<Segment>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && (e.newValue === "importer" || e.newValue === "treasury")) {
        setSegmentState(e.newValue);
      }
    };
    const onCustom = () => setSegmentState(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("canta:segment-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("canta:segment-change", onCustom);
    };
  }, []);

  const setSegment = useCallback((s: Segment) => {
    window.localStorage.setItem(KEY, s);
    window.dispatchEvent(new Event("canta:segment-change"));
    setSegmentState(s);
  }, []);

  return { segment, setSegment };
};

export const setSegmentValue = (s: Segment) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, s);
  window.dispatchEvent(new Event("canta:segment-change"));
};
