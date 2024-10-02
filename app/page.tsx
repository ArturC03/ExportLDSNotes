'use client';
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


const handleDownload = () => {
  console.log("A tentar descarregar notas");
  fetch("https://www.churchofjesuschrist.org/notes/api/v3/annotations/export/csv?highlightsWithNotesOnly=false", {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'notas_lds.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    console.log("Notas descarregadas com sucesso");
  })
  .catch(error => console.error("Erro ao descarregar notas:", error));
}

const handleLogin = () => {
  console.log("Login Popup opened");
  const popup = window.open("https://www.churchofjesuschrist.org/my-home/auth/okta?lang=eng&return_uri=https%3A%2F%2Fwww.churchofjesuschrist.org%2Fmy-home%3Flang%3Deng", "_blank", "noopener,noreferrer");
};

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Processar o ficheiro para JSON
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      const jsonData = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {} as Record<string, string>);
      });
      console.log("Ficheiro processado para JSON:", jsonData);
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

  var nextButton = <></>;
  var dialogTitle = <></>;
  var dialogDescription = <></>;
  var dialogContent = <></>;
  if (isLoggedIn) {
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
        //dialogContent = <Button onClick={handleConvert} variant="outline" className="mt-4">Convert Notes</Button>;
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