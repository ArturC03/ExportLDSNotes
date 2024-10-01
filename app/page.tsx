'use client';

import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isRedirected, setIsRedirected] = useState(false);

  const handleClick = () => {
    const url = "https://id.churchofjesuschrist.org/oauth2/default/v1/authorize?response_type=code&client_id=0oa5b6krts7UNNkID357&redirect_uri=https%3A%2F%2Fwww.churchofjesuschrist.org%2Fservices%2Fplatform%2Fv4%2Flogin&scope=openid+profile&state=https%3A%2F%2Fwww.churchofjesuschrist.org%2Flogin%3Flang%3Deng";
    const newWindow = window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <>
      <Button onClick={handleClick}>Clique-me</Button>
    </>
  );
}
