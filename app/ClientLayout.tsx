"use client";

import { useState, useEffect } from "react";
import Providers from "./Providers";
import Loading from "./Loading";

const InitialStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    body {
      background-color: #008080;
      margin: 0;
      padding: 0;
    }
  `,
    }}
  />
);

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Slight delay before showing the loader
    const loaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 100);

    // Simulate loading time
    const contentTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust this time as needed

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <>
      <InitialStyles />
      <Providers>
        {isLoading ? showLoader ? <Loading /> : null : children}
      </Providers>
    </>
  );
}
