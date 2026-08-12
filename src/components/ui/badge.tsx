import { cn } from "../../lib/utils"
const variants: Record<string,string>={default:"bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",outline:"border text-foreground"}
function Badge({className,variant="default",...props}:React.HTMLAttributes<HTMLDivElement>&{variant?:"default"|"secondary"|"outline"}){
  return <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",variants[variant],className)} {...props}/>
}
export {Badge}