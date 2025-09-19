import AppSidebar from "../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

function LayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default LayoutPage;