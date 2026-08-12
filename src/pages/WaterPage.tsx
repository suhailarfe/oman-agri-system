import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { waterSolutions } from "../data/farms"
import { Droplets, Sun, CloudRain, Waves, Sprout, Building2 } from "lucide-react"

const icons: Record<number, any> = { 0: Sun, 1: Building2, 2: CloudRain, 3: Sprout, 4: Waves }
const colors = ["from-amber-500/20", "from-blue-500/20", "from-cyan-500/20", "from-emerald-500/20", "from-indigo-500/20"]

export default function WaterPage() {
  return (<div className="space-y-6"><div><h1 className="text-2xl font-bold tracking-tight">حلول المياه</h1><p className="text-muted-foreground">6 حلول مبتكرة لتوفير المياه للري ضمن رؤية عُمان 2040</p></div>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{waterSolutions.map((ws,i)=>{const Icon=icons[i]||Droplets;return(<Card key={i} className={`bg-gradient-to-b ${colors[i]} to-background border-border/50 hover:shadow-lg transition-shadow`}><CardHeader><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-background/80"><Icon className="h-5 w-5 text-emerald-600" /></div><CardTitle className="text-base">{ws.name}</CardTitle></div></CardHeader><CardContent className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">التكلفة</span><strong>{ws.cost}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">السعة</span><strong>{ws.capacity}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">الحالة</span><span className="px-2 py-0.5 rounded-full text-xs bg-emerald-600/10 text-emerald-600">{ws.status}</span></div></CardContent></Card>)})}</div></div>)
}