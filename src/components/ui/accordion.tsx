import { cn } from "../../lib/utils"
import { useState, createContext, useContext } from "react"
interface AccordionContextType { openItems: Set<string>; toggle: (v: string) => void }
const AccordionContext = createContext<AccordionContextType>({ openItems: new Set(), toggle: () => {} })
function Accordion({ children }: { children: React.ReactNode }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  return <AccordionContext.Provider value={{ openItems, toggle: (v) => { const next = new Set(openItems); next.has(v) ? next.delete(v) : next.add(v); setOpenItems(next) } }}><div className="w-full">{children}</div></AccordionContext.Provider>
}
function AccordionItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { openItems, toggle } = useContext(AccordionContext)
  const isOpen = openItems.has(value)
  return <div className="border-b"><button className="flex w-full items-center justify-between py-4 text-sm font-medium hover:underline" onClick={() => toggle(value)}>{children}<span className="ml-2">{isOpen ? "▲" : "▼"}</span></button>{isOpen && <div className="overflow-hidden pb-4 pt-0 text-sm">{children}</div>}</div>
}
function AccordionTrigger({ children }: { children: React.ReactNode }) { return <>{children}</> }
function AccordionContent({ children }: { children: React.ReactNode }) { return <>{children}</> }
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }