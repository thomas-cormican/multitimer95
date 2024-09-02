"use client";

import { ThemeProvider, createGlobalStyle } from "styled-components";
import { styleReset } from "react95";
import original from "react95/dist/themes/original";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
`;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
