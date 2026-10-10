import { notFound } from "next/navigation";

// Keep unknown paths inside the locale layout and its translated 404 boundary.
export default function UnknownPage() {
  notFound();
}
