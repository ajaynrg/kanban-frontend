import { SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter, Sidebar } from "./ui/sidebar";

function AppSidebar(){
    return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar;