import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { regions, stats } from "../data/regions"
import { farms } from "../data/farms"
import { formatCurrency, formatNumber } from "../lib/utils"
import { Map, Sprout, TrendingUp, DollarSign } from "lucide-react"

const statCards = [
  { title: "إجمالي المساحة", value: `${formatNumber(stats.totalAreaHa / 1000000)}M هكتار`, icon: Map, color: "text-blue-600", bg: "bg-blue-600/10" },
  { title: "المساحة المزروعة", value: `${formatNumber(stats.totalCultivatedHa)} هكتار`, icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  { title: "مناطق نشطة", value: stats.activeRegions, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-600/10" },
  { title: "إجمالي الاستثمار", value: formatCurrency(stats.totalInvestmentOMR), icon: DollarSign, color: "text-purple-600", bg: "bg-purple-600/10" },
]
const sv: Record<string, "default"|"secondary"|"outline"> = { "نشط":"default", "قيد التطوير":"secondary", "مخطط":"outline", "منتج":"default", "قيد الإنشاء":"secondary" }

export default function DashboardPage() {
  return (<div className="space-y-6"><div><h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1><p className="text-muted-foreground">نظرة عامة على المشروع الزراعي — رؤية عُمان 2040</p></div>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{statCards.map(c=>(<Card key={c.title} className="border-border/50"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle><div className={`${c.bg} p-2 rounded-lg`}><c.icon className={`h-4 w-4 ${c.color}`} /></div></CardHeader><CardContent><div className="text-2xl font-bold">{c.value}</div></CardContent></Card>))}</div>
  <div className="grid gap-6 md:grid-cols-2"><Card><CardHeader><CardTitle className="text-lg">المناطق الزراعية</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>المنطقة</TableHead><TableHead>المحافظة</TableHead><TableHead>المساحة</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{regions.map(r=>(<TableRow key={r.id}><TableCell className="font-medium">{r.name}</TableCell><TableCell className="text-muted-foreground">{r.governorate}</TableCell><TableCell>{formatNumber(r.totalAreaHa)}</TableCell><TableCell><Badge variant={sv[r.status]}>{r.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
  <Card><CardHeader><CardTitle className="text-lg">المزارع</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>المزرعة</TableHead><TableHead>المنطقة</TableHead><TableHead>المساحة</TableHead><TableHead>الحالة</TableHead></TableRow></TableHeader><TableBody>{farms.map(f=>(<TableRow key={f.id}><TableCell className="font-medium">{f.name}</TableCell><TableCell className="text-muted-foreground">{f.regionName}</TableCell><TableCell>{f.areaHa} هكتار</TableCell><TableCell><Badge variant={sv[f.status]}>{f.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card></div></div>)
}