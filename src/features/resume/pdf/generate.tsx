import path from "node:path";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import type { ResumeDocumentModel } from "../model/presentation";
import { ResumePdfDocument } from "./document";

// Local font files are included in the server deployment trace.
Font.register({
  family: "ResumeMontserrat",
  fonts: [
    { src: path.join(process.cwd(), "src/assets/fonts/montserrat-medium.ttf"), fontWeight: 500 },
    { src: path.join(process.cwd(), "src/assets/fonts/montserrat-bold.ttf"), fontWeight: 700 },
  ],
});
Font.register({
  family: "ResumeIranSans",
  fonts: [
    { src: path.join(process.cwd(), "src/assets/fonts/iran-sans-regular.ttf"), fontWeight: 400 },
    { src: path.join(process.cwd(), "src/assets/fonts/iran-sans-bold.ttf"), fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback(word => [word]);

export function generateResumePdf(document: ResumeDocumentModel) {
  return renderToBuffer(<ResumePdfDocument document={document} />);
}
