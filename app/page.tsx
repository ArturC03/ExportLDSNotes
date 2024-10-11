"use client";

import { csvToJson } from "@/app/includes/csvToJson";
import Head from "next/head";
// Components
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
// Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Icons
import { FaMarkdown } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";
import { VscJson } from "react-icons/vsc";
import { TbTxt } from "react-icons/tb";
import { SiAdobeacrobatreader } from "react-icons/si";
import { FaHtml5 } from "react-icons/fa";

let csvContent = "";

const convertTo = {
  markdown: <FaMarkdown />,
  csv: <RiFileExcel2Fill />,
  json: <VscJson />,
  txt: <TbTxt />,
  pdf: <SiAdobeacrobatreader />,
  html: <FaHtml5 />,
};

const handleDownload = () => {
  console.log("A tentar iniciar o download das notas");

  const handleDownloadError = (error: Error) => {
    console.error(
      "Erro ao tentar iniciar o download das notas:",
      error.message,
    );
    // Por exemplo, mostrar uma mensagem ao utilizador
  };

  const initiateDownload = () => {
    try {
      console.log("A tentar aceder à página de exportação de notas.");
      window.close;
      // URL para a página de login
      const downloadUrl =
        "https://www.churchofjesuschrist.org/notes/api/v3/annotations/export/csv?highlightsWithNotesOnly=false";

      // Abrir a página de login numa nova janela
      window.open(downloadUrl, "_blank", "noopener,noreferrer");

      console.log(
        "Página de login aberta. O utilizador deve fazer login e navegar manualmente para a exportação de notas.",
      );
    } catch (error) {
      handleDownloadError(
        error instanceof Error
          ? error
          : new Error("Erro ao tentar abrir a página de login"),
      );
    }
  };

  initiateDownload();
};

const handleLogin = () => {
  console.log("Login Popup opened");
  window.open(
    "https://www.churchofjesuschrist.org/notes?",
    "LoginWindow",
    "width=600,height=700,noopener,noreferrer",
  );
};

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [i, setI] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const nSteps = 5;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNext = () => {
    if (!fileUploaded && i > 2) {
      toast({
        variant: "destructive",
        title: "Ups! Looks like you didn't upload a file",
        description: "Please upload a file before proceeding",
      });
    } else {
      setI(i + 1);
    }
  };

  const goToViewCSV = () => {
    if (blobUrl) {
      router.push(`/ViewCSV?blobUrl=${encodeURIComponent(blobUrl)}`);
    } else {
      toast({
        variant: "destructive",
        title: "Ups! Looks like you didn't upload a file",
        description: "Please upload a file before proceeding",
      });
      console.error("No Blob URL available");
      // Handle the error, maybe show a toast to the user
    }
  };

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvText = e.target?.result as string;
        console.log("CSV file content:", csvText);

        try {
          const jsonData = await csvToJson(csvText);
          console.log("Converted JSON:", jsonData);

          // Create a Blob from the JSON data
          const jsonBlob = new Blob([JSON.stringify(jsonData)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(jsonBlob);

          setBlobUrl(url);
          setFileUploaded(true);
        } catch (error) {
          console.error("Error processing CSV:", error);
          // Handle error (e.g., show error message to user)
        }
      };
      reader.readAsText(file);
      console.log("Selected file:", file.name);
      setSelectedFile(file);
    }
  };
  // The next button, dialog title, description and content are initialized as empty
  let nextButton = <></>;
  let dialogTitle = <></>;
  let dialogDescription = <></>;
  let dialogContent = <></>;

  // When the user is logged in and ready to start the conversion process
  if (isLoggedIn) {
    // The steps of the conversion process
    switch (i) {
      case 1: // Let's Get Started
        dialogTitle = <>Let's Get Started</>;
        dialogDescription = (
          <>
            This tool will help you convert your notes from the LDS website so
            that you can have access to them in your favorite note-taking app.
          </>
        );
        nextButton = <>Get Started</>;
        break;
      case 2: // Download your notes
        dialogTitle = <>Download your notes</>;
        dialogDescription = (
          <>
            To convert your notes, we need to download them from the LDS
            website. Please click the button below to download your notes.
          </>
        );
        dialogContent = (
          <Button onClick={handleDownload} variant="outline" className="mt-4">
            Download Notes
          </Button>
        );
        nextButton = <>Next</>;
        break;
      case 3: // Upload your notes
        dialogTitle = <>Upload your notes</>;
        dialogDescription = (
          <>
            Now that we have your notes, we need to upload them to your
            note-taking app. Please drag and drop the file below.
          </>
        );
        dialogContent = (
          <>
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            <Button onClick={goToViewCSV}>View CSV</Button>
          </>
        );
        nextButton = <>Next</>;
        break;
      case 4: // Convert your notes
        dialogTitle = <>Convert your notes</>;
        dialogDescription = (
          <>
            Now that we have your notes, we need to convert them to a format
            that your note-taking app can understand. Please click the button
            below to convert your notes.
          </>
        );
        dialogContent = (
          <>
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              {Object.entries(convertTo).map(([index, content]) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col items-center">
                    <Toggle
                      id={`button-${index}`}
                      variant="outline"
                      className="icon-button w-24 h-24 text-3xl"
                    >
                      {content}
                    </Toggle>
                    <Label
                      htmlFor={`button-${index}`}
                      className="mt-2 text-center font-bold text-base"
                    >
                      {index.toUpperCase()}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
        nextButton = <>Next</>;
        break;
      default:
        dialogTitle = <>Conversion complete</>;
        dialogDescription = (
          <>
            Your notes have been converted. You can now use them in your
            favorite note-taking app.
          </>
        );
        dialogContent = <></>;
        nextButton = <>Close</>;
        break;
    }
    return (
      <div className="flex justify-center items-center h-screen">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Convert Notes</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            {dialogContent}
            <Button onClick={handleNext} variant="outline">
              {nextButton}
            </Button>
            <Separator className="mt-2 my-4" />
            <Progress value={(i / nSteps) * 100} />
          </DialogContent>
        </Dialog>
      </div>
    );
  } else {
    return (
      <>
        <Head>
          <title> Export LDS Notes</title>
        </Head>
        <div className="flex justify-center items-center h-screen">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Click me</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Make sure you're logged into your LDS account
                </DialogTitle>
                <DialogDescription>
                  To proceed, you <b>must</b> be logged in. If you aren't,
                  please{" "}
                  <span>
                    <Button
                      variant="link"
                      className="p-0 m-0"
                      onClick={handleLogin}
                    >
                      Log in
                    </Button>
                  </span>
                </DialogDescription>
              </DialogHeader>
              <Button onClick={() => setIsLoggedIn(true)}>I'm logged in</Button>
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  }
}
