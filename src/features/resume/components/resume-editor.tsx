"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { applyResumeLocation, resumeLocationMaxLength } from "../model/location";
import type { ResumeDocumentModel } from "../model/presentation";
import { ResumeDocument } from "./resume-document";
import { PrintButton } from "./print-button";

type Labels = { location: string; locationHint: string; resetLocation: string; download: string; print: string; preparing: string };

export function ResumeEditor({ document: original, labels }: { document: ResumeDocumentModel; labels: Labels }) {
  const [location, setLocation] = useState(original.location);
  const id = useId();
  const cv = applyResumeLocation(original, location);
  const query = new URLSearchParams({ locale: cv.locale });
  if (cv.location !== original.location) query.set("location", cv.location);

  return <>
    <div className="cv-export-controls">
      <div className="cv-location-field">
        <label htmlFor={id}>{labels.location}</label>
        <input id={id} value={location} onChange={event => setLocation(event.target.value)} maxLength={resumeLocationMaxLength} dir="auto" aria-describedby={`${id}-hint`} />
        <p id={`${id}-hint`}>{labels.locationHint}</p>
      </div>
      <div className="cv-actions">
        <Button variant="secondary" disabled={location === original.location} onClick={() => setLocation(original.location)}>{labels.resetLocation}</Button>
        <a className="ui-button" href={`/api/resume/${cv.profile}?${query}`} download={cv.fileName}>{labels.download}</a>
        <PrintButton label={labels.print} pendingLabel={labels.preparing} />
      </div>
    </div>
    <ResumeDocument document={cv} />
  </>;
}
