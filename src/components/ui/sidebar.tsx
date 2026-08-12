import { cn } from "../../lib/utils"
import { useState, createContext, useContext } from "react"
const SidebarContext = createContext({ open: true, setOpen: (o: boolean) => {} })
function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
}
function SidebarTrigger({ className }: { className?: string }) {
  const { open, setOpen } = useContext(SidebarContext)
  return <button className={cn("p-2 rounded-md hover:bg-accent", className)} onClick={() => setOpen(!open)}>{open ? "◀" : "▶"}</button>
}
function Sidebar({ children, side, className }: { children: React.ReactNode; side?: string; className?: string }) {
  const { open } = useContext(SidebarContext)
  return <aside className={cn("bg-sidebar text-sidebar-foreground border-sidebar-border transition-all duration-300 flex flex-col shrink-0", side === "right" ? "border-l" : "border-r", open ? "w-64" : "w-0 overflow-hidden", className)}>{open && children}</aside>
}
function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) { return <div className={cn("", className)}>{children}</div> }
function SidebarContent({ children }: { children: React.ReactNode }) { return <div className="flex-1 overflow-auto">{children}</div> }
function SidebarGroup({ children }: { children: React.ReactNode }) { return <div className="px-3 py-2">{children}</div> }
function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={cn("mb-2 px-2 text-xs font-semibold tracking-tight", className)}>{children}</div> }
function SidebarGroupContent({ children }: { children: React.ReactNode }) { return <div>{children}</div> }
function SidebarMenu({ children }: { children: React.ReactNode }) { return <div className="space-y-1">{children}</div> }
function SidebarMenuItem({ children }: { children: React.ReactNode }) { return <div>{children}</div> }
function SidebarMenuButton({ children }: { children: React.ReactNode }) { return <>{children}</> }
function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={cn("mt-auto", className)}>{children}</div> }
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger }