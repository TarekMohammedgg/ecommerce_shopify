import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export const metadata = {
  title: "نسيج | Naseej — Premium Fashion",
  description:
    "نسيج — علامة أزياء عربية بخامات نقية وتصاميم عصرية. Naseej — bilingual premium clothing storefront.",
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

export default function StoreLayout({ children }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
