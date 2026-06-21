import ServiceHeader from "@/components/ServiceHeader";
import ServiceFooter from "@/components/ServiceFooter";

export default function ServiceLayout({ children }) {
  return (
    <>
      <ServiceHeader />
      <main className="flex-1 w-full min-w-0 flex flex-col overflow-x-clip">{children}</main>
      <ServiceFooter />
    </>
  );
}
