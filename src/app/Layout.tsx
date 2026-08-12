import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { AppSidebar } from "../app/AppSidebar"
import { TooltipProvider } from "../components/ui/tooltip"
import { Toaster } from "../components/ui/toast"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { useLocation } from "react-router-dom"

const breadcrumbMap: Record<string, string> = { "/": "لوحة التحكم", "/regions": "المناطق الزراعية", "/farms": "المزارع والمحاصيل", "/water": "حلول المياه", "/reports": "التقارير", "/settings": "الإعدادات" }

export default function Layout() {
  const location = useLocation()
  const currentPage = breadcrumbMap[location.pathname] || ""
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background" dir="rtl">
          <AppSidebar />
          <main className="flex-1 flex flex-col min-w-0">
            <header className="flex items-center gap-4 border-b border-border px-6 py-3 sticky top-0 bg-background z-10">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/">الرئيسية</BreadcrumbLink></BreadcrumbItem>{currentPage && <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href={location.pathname}>{currentPage}</BreadcrumbLink></BreadcrumbItem></>}</BreadcrumbList></Breadcrumb>
              <div className="mr-auto text-sm text-muted-foreground">🇴🇲 رؤية عُمان 2040 — نظام إدارة المشروع الزراعي</div>
            </header>
            <div className="flex-1 p-6 overflow-auto"><Outlet /></div>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  )
}