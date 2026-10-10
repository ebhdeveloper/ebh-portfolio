"use client";

import { useEffect, useRef } from "react";
import { resumeProfiles } from "../model/presentation";
import "../menu.css";

type ResumeMenuProps = { label: string; links: { profile: string; href: string }[] };

export function ResumeMenu({ label, links }: ResumeMenuProps) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target) && ref.current) ref.current.open = false;
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && ref.current?.open) {
        const shouldRestoreFocus = ref.current.contains(document.activeElement);
        ref.current.open = false;
        if (shouldRestoreFocus) ref.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details className="cv-menu" ref={ref}>
      <summary>{label}<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
      <ul>
        {resumeProfiles.map(profile => <li key={profile.id}><a href={links.find(link => link.profile === profile.id)!.href} lang="en" dir="ltr"><span>{profile.label}</span><span aria-hidden="true">↗</span></a></li>)}
      </ul>
    </details>
  );
}
