"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const [pending, setPending] = useState(false);
  async function print() {
    setPending(true);
    try {
      await document.fonts.ready;
      window.print();
    } finally {
      setPending(false);
    }
  }
  return <Button variant="secondary" disabled={pending} onClick={print}>{pending ? pendingLabel : label}</Button>;
}
