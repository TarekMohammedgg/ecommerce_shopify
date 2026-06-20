import ServiceHeader from "@/components/ServiceHeader";
import ServiceFooter from "@/components/ServiceFooter";

export default function ServiceLayout({ children }) {
  return (
    <>
      <ServiceHeader />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <ServiceFooter />
    </>
  );
}
