import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { regions } from "../data/regions"
import { formatNumber } from "../lib/utils"
import { Search } from "lucide-react"

const v: Record<string, "default"|"secondary"|"outline"> = { "نشط":"default", "قيد التطوير":"secondary", "مخطط":"outline" }

export default function RegionsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("الكل")
  const filtered = regions.filter(r => (r.name.includes(search)||r.governorate.includes(search)||r.mainCrops.includes(search)) && (statusFilter==="الكل"||r.status===statusFilter))
  return (<div className="space-y-6"><div><h1 className="text-2xl font-bold tracking-tight">المناطق الزراعية</h1><p className="text-muted-foreground">5 مناطق زراعية حكومية واعدة ضمن رؤية عُمان 2040</p></div>
  <div className="flex gap-4"><div className="relative flex-1 max-w-sm"><Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} className="pr-9" /></div>
  <Select value={statusFilter} onValueChange={(v)=>setStatusFilter(v||"الكل")}><SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="الكل">الكل</SelectItem><SelectItem value="نشط">نشط</SelectItem><SelectItem value="قيد التطوير">قيد التطوير</SelectItem><SelectItem value="مخطط">مخطط</SelectItem></SelectContent></Select></div>
  <div className="grid gap-6 lg:grid-cols-2">{filtered.map(r=>(<Card key={r.id} className="border-border/50 hover:shadow-md transition-shadow"><CardHeader><div className="flex justify-between items-start"><div><CardTitle className="text-lg">{r.name}</CardTitle><p className="text-sm text-muted-foreground">{r.governorate}</p></div><Badge variant={v[r.status]}>{r.status}</Badge></div></CardHeader><CardContent className="space-y-3"><div className="grid grid-cols-2 gap-2 text-sm"><div><span className="text-muted-foreground">المساحة: </span><strong>{formatNumber(r.totalAreaHa)} هكتار</strong></div><div><span className="text-muted-foreground">المزروع: </span><strong>{formatNumber(r.cultivatedAreaHa)} هكتار</strong></div><div className="col-span-2"><span className="text-muted-foreground">المناخ: </span>{r.climateType}</div><div className="col-span-2"><span className="text-muted-foreground">التربة: </span>{r.soilType}</div><div className="col-span-2"><span className="text-muted-foreground">المياه: </span>{r.waterSource}</div><div className="col-span-2"><span className="text-muted-foreground">المحاصيل: </span><Badge variant="outline">{r.mainCrops}</Badge></div></div></CardContent></Card>))}</div></div>)
}