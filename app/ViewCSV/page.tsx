// app/ViewCSV/page.tsx
import { Suspense } from "react";
import ViewCSVContent from "./ViewCSVContent";
import { Separator } from "@/components/ui/separator";
import JsonToMarkdown from "../json-markdown";
export default function ViewCSV() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewCSVContent/>
      <Separator className="my-4"/>
      <JsonToMarkdown/>
    </Suspense>
  );
}
