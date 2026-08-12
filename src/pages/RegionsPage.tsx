import { useState } from 'react'
import { Search } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { regions } from '../data/all'
import { Badge } from '../components/Badge'
const COLS=['var(--teal)','var(--gold)','var(--indigo)','var(--green)','var(--red)']

export default function RegionsPage(){
  const [s,setS]=useState('')
  const [sf,setSf]=useState('الكل')
  const [sel,setSel]=useState<number|null>(null)
  const filtered=regions.filter(r=>(r.name.includes(s)||r.crops.includes(s))&&(sf==='الكل'||r.status===sf))
  return <div style={{maxWidth:1280,margin:'0 auto',padding:'32px 24px',display:'flex',flexDirection:'column',gap:28}}>
    <div><h1 className="page-h1">🗺️ المناطق الزراعية</h1><p className="page-sub">5 مناطق حكومية واعدة — رؤية عُمان 2040</p></div>
    <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
      <div style={{position:'relative',flex:'1 1 300px'}}><Search size={16} style={{position:'absolute',right:14,top:14,color:'var(--text3)',pointerEvents:'none'}}/><input className="input" placeholder="بحث عن منطقة أو محصول..." value={s} onChange={e=>setS(e.target.value)}/></div>
      <select className="select" value={sf} onChange={e=>setSf(e.target.value)}><option value="الكل">كل الحالات</option><option value="نشط">نشط</option><option value="قيد التطوير">قيد التطوير</option><option value="مخطط">مخطط</option></select></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))',gap:20}}>
      {filtered.map((r,i)=><div key={i} onClick={()=>setSel(sel===i?null:i)} className="card" style={{padding:24,cursor:'pointer',borderRight:sel===i?'4px solid var(--teal)':'4px solid transparent',transition:'all .2s'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}><div><h3 style={{fontSize:18,fontWeight:700}}>{r.name}</h3><span style={{fontSize:13,color:'var(--text3)'}}>{r.gov}</span></div><Badge label={r.status}/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,fontSize:14}}>
          <div><span style={{color:'var(--text3)'}}>المساحة:</span> <strong>{r.area} هـ</strong></div><div><span style={{color:'var(--text3)'}}>المزروع:</span> <strong>{r.cult} هـ</strong></div>
          <div><span style={{color:'var(--text3)'}}>المناخ:</span> {r.climate}</div><div><span style={{color:'var(--text3)'}}>التربة:</span> {r.soil}</div></div>
        {sel===i && <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:8,fontSize:14}}><div><span style={{color:'var(--text3)'}}>💧 المياه:</span> {r.water}</div><div><span style={{color:'var(--text3)'}}>🌾 المحاصيل:</span> {r.crops}</div></div>}</div>)}</div>
    <div className="card" style={{padding:28,display:'flex',flexDirection:'column',alignItems:'center'}}><h3 style={{fontSize:18,fontWeight:700,marginBottom:24,color:'var(--teal)'}}>📊 توزيع المساحات المزروعة</h3>
      <ResponsiveContainer width="100%" height={340}><PieChart><Pie data={regions.map(r=>({name:r.name,value:parseInt(r.cult.replace(/,/g,''))}))} cx="50%" cy="50%" innerRadius={80} outerRadius={130} paddingAngle={5} dataKey="value">{regions.map((_,i)=><Cell key={i} fill={COLS[i]} stroke="white" strokeWidth={2}/>)}</Pie><Tooltip contentStyle={{borderRadius:12,border:'1px solid var(--border)',fontFamily:'Kanit',fontSize:13}}/></PieChart></ResponsiveContainer>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:20,marginTop:16,fontSize:13}}>{regions.map((r,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:14,height:14,borderRadius:3,background:COLS[i]}}/>{r.name} — {r.cult} هـ</div>)}</div></div></div>}