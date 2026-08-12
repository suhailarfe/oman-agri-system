import { cn } from "../../lib/utils"
import { useState, createContext, useContext } from "react"
interface TabsContextType { value: string; setValue: (v: string) => void }
const TabsContext = createContext<TabsContextType>({ value: "", setValue: () => {} })
function Tabs({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [value, setValue] = useState(defaultValue)
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>
}
function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>{children}</div>
}
function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  return <button className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all", ctx.value === value && "bg-background text-foreground shadow", className)} onClick={() => ctx.setValue(value)}>{children}</button>
}
function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)
  if (ctx.value !== value) return null
  return <div className="mt-2">{children}</div>
}
export { Tabs, TabsContent, TabsList, TabsTrigger }