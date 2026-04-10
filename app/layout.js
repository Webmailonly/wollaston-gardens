import "./globals.css";

export const metadata = {
  title: "Wollaston Gardens",
  description: "Food truck booking and seasonal calendar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
