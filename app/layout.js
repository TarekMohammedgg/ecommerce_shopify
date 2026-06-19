import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export const metadata = {
  title: "نسيج | Naseej — Premium Fashion",
  description: "نسيج — علامة أزياء عربية بخامات نقية وتصاميم عصرية. Naseej — bilingual premium clothing storefront.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-white text-brand-dark min-h-full flex flex-col antialiased overflow-x-hidden relative" suppressHydrationWarning>
        <Providers>
          {/* Sticky Header */}
          <Header />

          {/* Cart Sliding Drawer */}
          <CartDrawer />

          {/* Main Layout Area */}
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>

          {/* Footer Component */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
