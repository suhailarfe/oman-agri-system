import { cn } from "../../lib/utils"
function Breadcrumb({className,...props}:React.HTMLAttributes<HTMLElement>){return <nav className={cn("",className)} {...props}/>}
function BreadcrumbList({className,...props}:React.HTMLAttributes<HTMLOListElement>){return <ol className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",className)} {...props}/>}
function BreadcrumbItem({className,...props}:React.HTMLAttributes<HTMLLIElement>){return <li className={cn("inline-flex items-center gap-1.5",className)} {...props}/>}
function BreadcrumbLink({className,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>){return <a className={cn("transition-colors hover:text-foreground",className)} {...props}/>}
function BreadcrumbSeparator(){return <li className="mx-1">/</li>}
export {Breadcrumb,BreadcrumbItem,BreadcrumbLink,BreadcrumbList,BreadcrumbSeparator}