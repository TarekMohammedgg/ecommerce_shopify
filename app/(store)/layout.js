import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export const metadata = {
  title: "نسيج | Naseej — Premium Fashion",
  description:
    "نسيج — علامة أزياء عربية بخامات نقية وتصاميم عصرية. Naseej — bilingual premium clothing storefront.",
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
