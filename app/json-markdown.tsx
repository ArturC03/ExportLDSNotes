// Suggested code may be subject to a license. Learn more: ~LicenseLog:1519612966.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1524685369.
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

interface NoteData {
  [key: string]: any;
}

export default function JsonToMarkdown() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<NoteData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      const blobUrl = searchParams.get("blobUrl");
      if (blobUrl) {
        try {
          const response = await fetch(blobUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            "Unable to load data. The link may have expired or is no longer valid.",
          );
        }
      } else {
        setError("No data URL provided.");
      }
    };

    getData();
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data) {
    return (
      <>
      <div>
        {data
        .filter((note) => note.type === "journal")
        .map((note) => (
          <>
          <div key={note.title}>
            <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
            <p className="">{note.noteText}</p>
          </div>
        <Separator/>
          </>
        ))}
      </div>
      </>
    );
  }

  return null;
}