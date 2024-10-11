// app/ViewCSV/page.tsx
import { Suspense } from "react";
import ViewCSVContent from "./ViewCSVContent";

export default function ViewCSV() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewCSVContent />
    </Suspense>
  );
}
