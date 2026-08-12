import { waterSolutions } from '../data/all';import { Badge } from '../components/Badge'
export default function WaterPage(){return <div style={{maxWidth:1280,margin:'0 auto',padding:'32px 24px',display:'flex',flexDirection:'column',gap:24}}>
<div><h1 className="page-h1">💧 حلول المياه</h1><p className="page-sub">6 تقنيات مبتكرة للري — رؤية عُمان 2040</p></div>
<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))',gap:20}}>{waterSolutions.map((w,i)=><div key={i} className="card" style={{padding:28,display:'flex',flexDirection:'column',gap:16,position:'relative',overflow:'hidden'}}>
<div style={{position:'absolute',top:0,left:0,right:0,height:4,background:'linear-gradient(90deg,var(--indigo),var(--teal))'}}/>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{width:52,height:52,borderRadius:14,background:'var(--indigo-light)',display:'flex',alignItems:'center',justifyContent:'center'}}><w.icon size={24} color="var(--indigo)"/></div><Badge label={w.status}/></div>
<h3 style={{fontSize:18,fontWeight:700}}>{w.name}</h3>
<p style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>{w.desc}</p>
<div style={{display:'flex',gap:20,fontSize:13,paddingTop:12,borderTop:'1px solid var(--border)'}}><div><span style={{color:'var(--text3)'}}>التكلفة </span><strong style={{color:'var(--indigo)'}}>{w.cost}</strong></div><div><span style={{color:'var(--text3)'}}>السعة </span><strong style={{color:'var(--teal)'}}>{w.cap}</strong></div></div></div>)}</div></div>}