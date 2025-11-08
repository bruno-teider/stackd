import "./globals.css";
import { RegisterProvider } from "./context/RegisterContext";
import { SnackbarProvider } from "./context/SnackbarContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RegisterProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </RegisterProvider>
      </body>
    </html>
  );
}
