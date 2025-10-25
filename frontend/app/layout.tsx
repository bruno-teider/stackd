import "./globals.css";
import { RegisterProvider } from "./context/RegisterContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RegisterProvider>{children}</RegisterProvider>
      </body>
    </html>
  );
}
