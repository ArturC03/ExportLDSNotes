"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Notes, columns } from "./columns";
import { DataTable } from "./data-table";
import Head from "next/head";

export default function ViewCSV() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<Notes[]>([]);
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
          setData(jsonData as Notes[]);
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

  return (
    <>
      <Head>
        <title>View CSV</title>
      </Head>
      <div className="mx-4 flex justify-center items-center h-screen">
        <div className="w-screen m-4 rounded-md border p-4">
          {data.length > 0 ? (
            <DataTable columns={columns} data={data} />
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </div>
    </>
  );
}
