"use client";

import { useEffect } from "react";
import { initNativeShell } from "@/lib/native/capacitor";

export function NativeInit() {
  useEffect(() => {
    void initNativeShell();
  }, []);
  return null;
}
