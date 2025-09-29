import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter, Sidebar, SidebarGroupLabel, SidebarGroupContent, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

function AppSidebar({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const btns = ['Home', 'Boards', 'Teams', 'Calendar'];

    return (
   <SidebarProvider>
        <Sidebar>
        <SidebarHeader>
            <div className="flex items-center justify-center p-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kanban Board
            </h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                    {btns.map((btn) => (
                        <Button 
                            onClick={() => navigate(`/${btn.toLowerCase().replace(" ", "-")}`)}
                            key={btn} variant="ghost" size="sm" className="w-full justify-start cursor-pointer">
                            {btn}
                        </Button>
                    ))}
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup></SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <div className="p-4 border-t">
                <div className="flex items-center space-x-3 mb-3">
                    <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                        <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="w-full cursor-pointer">Logout</Button>
            </div>
        </SidebarFooter>
        </Sidebar>
        <SidebarTrigger className="cursor-pointer"/>
        <div className="flex-1 w-full h-full">
            {children}
        </div>
    </SidebarProvider>
  )
}

export default AppSidebar;