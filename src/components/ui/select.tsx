import { cn } from "../../lib/utils"
import { useState, createContext, useContext } from "react"
interface SelectContextType { value: string; onValueChange: (v: string) => void; open: boolean; setOpen: (o: boolean) => void }
const SelectContext = createContext<SelectContextType>({ value: "", onValueChange: () => {}, open: false, setOpen: () => {} })
function Select({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  return <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>{children}</SelectContext.Provider>
}
function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, setOpen } = useContext(SelectContext)
  return <button type="button" className={cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring", className)} onClick={() => setOpen(!open)} onBlur={() => setTimeout(() => setOpen(false), 200)}>{children}<span className="ml-2">▾</span></button>
}
function SelectValue({ placeholder }: { placeholder?: string }) { const { value } = useContext(SelectContext); return <span className={!value ? "text-muted-foreground" : ""}>{value || placeholder || ""}</span> }
function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open } = useContext(SelectContext)
  if (!open) return null
  return <div className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md", className)}>{children}</div>
}
function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { onValueChange, setOpen } = useContext(SelectContext)
  return <div className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground" onMouseDown={() => { onValueChange(value); setOpen(false) }}>{children}</div>
}
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }