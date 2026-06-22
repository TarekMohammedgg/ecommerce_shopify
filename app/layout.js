import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "تاجر | Tajer — مواقع للمحلات والمطاعم",
  description:
    "نصمم مواقع تجارة إلكترونية احترافية لمحلات الملابس والمطاعم والأنشطة التجارية. شاهد الديمو واطلب موقعك.",
  icons: {
    icon: [
      { url: "/brand/tajer-mark-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/tajer-mark-64.png", sizes: "64x64", type: "image/png" },
      { url: "/brand/tajer-icon.png", sizes: "308x308", type: "image/png" },
      { url: "/brand/target_logo.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/brand/tajer-mark-128.png", sizes: "128x128", type: "image/png" }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-white text-brand-dark min-h-full min-w-0 flex flex-col antialiased overflow-x-clip relative" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
