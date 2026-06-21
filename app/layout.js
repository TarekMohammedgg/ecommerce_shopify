import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "تاجر | Tajer — مواقع للمحلات والمطاعم",
  description:
    "نصمم مواقع تجارة إلكترونية احترافية لمحلات الملابس والمطاعم والأنشطة التجارية. شاهد الديمو واطلب موقعك.",
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
