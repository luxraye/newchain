import * as React from "react"
import {
  Activity,
  ArrowRightLeft,
  Box,
  Droplet,
  Hexagon,
  LayoutDashboard,
  ShieldAlert,
  Database,
  Terminal,
  Signal,
  Radio
} from "lucide-react"
import { Link, useLocation } from "wouter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetFacilities } from "@workspace/api-client-react"

export function Sidebar({ 
  facilityId, 
  setFacilityId 
}: { 
  facilityId: string
  setFacilityId: (id: string) => void
}) {
  const [location] = useLocation()
  
  const { data: facilitiesData, isLoading } = useGetFacilities()
  
  const navItems = [
    { name: "CMD_CENTRE", path: "/", icon: Terminal },
    { name: "UNIT_INDUCT", path: "/log", icon: Droplet },
    { name: "ROUTE_CTRL", path: "/transfers", icon: ArrowRightLeft },
    { name: "CHAIN_LOGS", path: "/ledger", icon: Database },
  ]

  return (
    <div className="flex flex-col h-full w-72 bg-[#040609] border-r border-secondary/20 text-slate-300 font-mono text-sm relative z-10">
      {/* Top Header */}
      <div className="p-6 border-b border-secondary/20 bg-secondary/5">
        <div className="flex items-center gap-3 mb-6 text-secondary">
          <div className="relative">
            <Hexagon className="h-8 w-8 fill-secondary/10 stroke-secondary animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-1 bg-secondary rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-secondary font-display uppercase leading-none">SANCTUM</h1>
            <p className="text-[10px] text-secondary/60 uppercase tracking-widest mt-1">SYS.TERMINAL.v2</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-semibold text-secondary/70 uppercase tracking-widest flex justify-between items-center">
            <span>Active Facility Node</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> ONLINE</span>
          </label>
          <Select value={facilityId} onValueChange={setFacilityId} disabled={isLoading}>
            <SelectTrigger className="w-full bg-black/50 border-secondary/30 text-secondary h-9 font-mono text-xs rounded-none focus:ring-secondary/50">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent className="bg-[#090d14] border-secondary/30 rounded-none text-secondary">
              {facilitiesData?.facilities?.map(f => (
                <SelectItem key={f.facilityId} value={f.facilityId || ""} className="focus:bg-secondary/20 focus:text-secondary rounded-none font-mono text-xs cursor-pointer">
                  <span className="text-secondary/50 mr-2">[{f.facilityId}]</span>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Nav */}
      <div className="px-4 py-6 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <div className="text-[10px] text-secondary/40 uppercase tracking-widest mb-4 px-2">System Modules</div>
          {navItems.map((item) => {
            const isActive = location === item.path
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 transition-all duration-0 relative ${
                  isActive 
                    ? "bg-secondary/10 text-secondary" 
                    : "hover:bg-secondary/5 text-slate-500 hover:text-secondary/80"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-secondary shadow-[0_0_8px_rgba(0,212,255,1)]" />
                )}
                <item.icon className={`h-4 w-4 ${isActive ? "text-secondary" : "text-slate-500 group-hover:text-secondary/60"}`} />
                <span className="tracking-wide uppercase text-xs">{item.name}</span>
                {isActive && (
                  <span className="ml-auto text-[10px] opacity-50">&lt;ACTIVE/&gt;</span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Footer Status */}
      <div className="p-4 border-t border-secondary/20 bg-[#020305]">
        <div className="flex items-center justify-between text-[10px] text-secondary/60">
          <div className="flex items-center gap-2">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>BLOODCHAIN_LINK</span>
          </div>
          <span className="text-green-500">SYNCED</span>
        </div>
      </div>
    </div>
  )
}
