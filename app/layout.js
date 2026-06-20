import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "استوديو نسيج | Naseej Studio — مواقع للمحلات والمطاعم",
  description:
    "نصمم مواقع تجارة إلكترونية احترافية لمحلات الملابس والمطاعم والأنشطة التجارية. شاهد الديمو واطلب موقعك.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-white text-brand-dark min-h-full flex flex-col antialiased overflow-x-hidden relative" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
