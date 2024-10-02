'use client';

// Components
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
// Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Icons
import { FaMarkdown } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";
import { VscJson } from "react-icons/vsc";
import { TbTxt } from "react-icons/tb";
import { SiAdobeacrobatreader } from "react-icons/si";
import { FaHtml5 } from "react-icons/fa";

var csvContent = "";
const convertTo = {
  markdown: <FaMarkdown />,
  csv: <RiFileExcel2Fill />,
  json: <VscJson />,
  txt: <TbTxt />,
  pdf: <SiAdobeacrobatreader />,
  html: <FaHtml5 />,
}

const handleDownload = () => {
  console.log("A tentar iniciar o download das notas");

  const handleDownloadError = (error: Error) => {
    console.error("Erro ao tentar iniciar o download das notas:", error.message);
    // Aqui pode-se adicionar lógica para lidar com o erro
    // Por exemplo, mostrar uma mensagem ao utilizador
  };

  const initiateDownload = () => {
    try {
      // URL para a página de exportação de notas
      const exportPageUrl = "https://www.churchofjesuschrist.org/notes/api/v3/annotations/export/csv?highlightsWithNotesOnly=false";
      // Abrir a página de exportação na mesma janela
      window.location.href = exportPageUrl;

      console.log("A redirecionar para a página de exportação. O utilizador deve seguir as instruções para completar o download.");
    } catch (error) {
      handleDownloadError(error instanceof Error ? error : new Error('Erro desconhecido ao redirecionar para a página de exportação'));
    }
  };

  initiateDownload();
}

const handleLogin = () => {
  console.log("Login Popup opened");
  const popup = window.open("https://www.churchofjesuschrist.org/my-home/auth/okta?lang=eng&return_uri=https%3A%2F%2Fwww.churchofjesuschrist.org%2Fmy-home%3Flang%3Deng", "_blank", "noopener,noreferrer");
};

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Processar o ficheiro CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      console.log("Conteúdo do ficheiro CSV:", csvText);
      csvContent = csvText;
    };
    reader.readAsText(file);
    console.log("Ficheiro selecionado:", file.name);
  }
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const nSteps = 5;
  const [i, setI] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // The next button, dialog title, description and content are initialized as empty
  var nextButton = <></>;
  var dialogTitle = <></>;
  var dialogDescription = <></>;
  var dialogContent = <></>;

  // When the user is logged in and ready to start the conversion process
  if (isLoggedIn) {
    // The steps of the conversion process
    switch (i) {
      case 1: // Let's Get Started
        dialogTitle = <>Let's Get Started</>;
        dialogDescription = <>This tool will help you convert your notes from the LDS website so that you can have access to them in your favorite note-taking app.</>;
        nextButton = <>Get Started</>;
        break;
      case 2: // Download your notes
        dialogTitle = <>Download your notes</>;
        dialogDescription = (
          <>
            To convert your notes, we need to download them from the LDS website. Please click the button below to download your notes.
          </>
        );

        dialogContent = <Button onClick={handleDownload} variant="outline" className="mt-4">Download Notes</Button>;
        nextButton = <>Next</>;
        break;
      case 3: // Upload your notes
        dialogTitle = <>Upload your notes</>;
        dialogDescription = (
          <>
          Now that we have your notes, we need to upload them to your note-taking app. Please drag and drop the file below.
          </>
        );
        dialogContent = (
          <>
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
          </>
        );
        nextButton = <>Next</>;
        break;
      case 4: // Convert your notes
        dialogTitle = <>Convert your notes</>;
        dialogDescription = (
          <>
            Now that we have your notes, we need to convert them to a format that your note-taking app can understand. Please click the button below to convert your notes.
          </>
        );
        dialogContent =
          <>
          <div className="grid grid-cols-3 gap-2 justify-items-center">
          {Object.entries(convertTo).map(([index, content]) => (
            <div key={index} className="mb-4">
              <div className="flex flex-col items-center">
                <Toggle id={`button-${index}`} variant="outline" className="icon-button w-24 h-24 text-3xl">
                  {content}
                </Toggle>
                <Label htmlFor={`button-${index}`} className="mt-2 text-center font-bold text-base">{index.toUpperCase()}</Label>
              </div>
            </div>
          ))}
          </div>
          </>;
        nextButton = <>Next</>;
        break;
      default:
        dialogTitle = <>Conversion complete</>;
        dialogDescription = (
          <>
            Your notes have been converted. You can now use them in your favorite note-taking app.
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
            <Button variant="outline">
              Convert Notes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                {dialogDescription}
              </DialogDescription>
            </DialogHeader>
            {dialogContent}
            <Button onClick={() => setI(i + 1)} variant="outline">
              {nextButton}
            </Button>
            <Separator className="mt-2 p-1my-4"/>
            <Progress value={i/nSteps * 100} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  else {
    return (
      <div className="flex justify-center items-center h-screen">
       <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Click me
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make sure you're logged into your LDS account</DialogTitle>
            <DialogDescription>
              To proceed, you <b>must</b> be logged in. If you aren't, please <span><Button variant="link" className="p-0 m-0" onClick={handleLogin}>Log in</Button></span>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsLoggedIn(true)}>
            I'm logged in
          </Button>
        </DialogContent>
      </Dialog>
    </div>
    );
  }
}