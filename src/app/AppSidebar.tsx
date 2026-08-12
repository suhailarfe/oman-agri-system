import { NavLink } from "react-router-dom"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "../components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { LayoutDashboard, Map, Sprout, Droplets, BarChart3, Settings, Leaf } from "lucide-react"

const items = [
  { title: "لوحة التحكم", url: "/", icon: LayoutDashboard },
  { title: "المناطق الزراعية", url: "/regions", icon: Map },
  { title: "المزارع والمحاصيل", url: "/farms", icon: Sprout },
  { title: "حلول المياه", url: "/water", icon: Droplets },
  { title: "التقارير", url: "/reports", icon: BarChart3 },
  { title: "الإعدادات", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar side="right" className="border-l border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-lg bg-emerald-600">
            <AvatarFallback className="bg-emerald-600 text-white"><Leaf className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">رؤية عُمان 2040</span>
            <span className="text-xs text-muted-foreground">الأمن الغذائي</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs">القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <NavLink to={item.url} end={item.url === "/"} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? "bg-emerald-600/10 text-emerald-600 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                      <item.icon className="h-4 w-4" /><span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8"><AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Qaboos_bin_Said_%282013%29.jpg/330px-Qaboos_bin_Said_%282013%29.jpg" /><AvatarFallback>سهيل</AvatarFallback></Avatar>
          <div className="flex flex-col"><span className="text-sm font-medium">سهيل الحكيمي</span><span className="text-xs text-muted-foreground">مدير النظام</span></div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}