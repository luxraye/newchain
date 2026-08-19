import React, { useState } from "react";
import { useLogBloodUnit, useGetFacilities } from "@workspace/api-client-react";
import { Database, Droplet, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LogUnit({ facilityId }: { facilityId: string }) {
  const [formData, setFormData] = useState({
    donorId: "",
    bloodType: "O+",
    temperature: "4.0",
    collectedAt: new Date().toISOString().slice(0, 16)
  });
  
  const { data: facilitiesData } = useGetFacilities();
  const logUnit = useLogBloodUnit();

  const [successUnit, setSuccessUnit] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessUnit(null);

    logUnit.mutate({
      data: {
        donorId: formData.donorId,
        facilityId: facilityId,
        bloodType: formData.bloodType,
        temperature: parseFloat(formData.temperature),
        collectedAt: new Date(formData.collectedAt).toISOString()
      }
    }, {
      onSuccess: (res) => {
        setSuccessUnit(res.unitId || "UNKNOWN_ID");
        setFormData(prev => ({ ...prev, donorId: "" })); // reset some fields
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-secondary/20 pb-4">
        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Unit Induction</h1>
        <p className="text-secondary/60 font-mono text-sm mt-1 uppercase tracking-widest">Register and cryptographically seal new blood units</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="terminal-panel p-6 border-l-2 border-l-secondary">
          <form onSubmit={handleSubmit} className="space-y-6 font-mono text-sm">
            
            <div className="space-y-2">
              <label className="text-secondary uppercase tracking-widest text-[10px] block">Donor Identification (ID)</label>
              <input 
                type="text" 
                name="donorId"
                required
                value={formData.donorId}
                onChange={handleChange}
                placeholder="D-2026-0891"
                className="w-full bg-black/50 border border-secondary/30 p-2 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 placeholder:text-slate-700 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-secondary uppercase tracking-widest text-[10px] block">Blood Type</label>
                <select 
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-secondary/30 p-2 text-white focus:outline-none focus:border-secondary"
                >
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-secondary uppercase tracking-widest text-[10px] block">Storage Temp (°C)</label>
                <input 
                  type="number" 
                  step="0.1"
                  name="temperature"
                  required
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-secondary/30 p-2 text-white focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-secondary uppercase tracking-widest text-[10px] block">Induction Facility</label>
              <input 
                type="text" 
                disabled
                value={facilityId}
                className="w-full bg-secondary/5 border border-secondary/10 p-2 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-secondary uppercase tracking-widest text-[10px] block">Collection Timestamp</label>
              <input 
                type="datetime-local" 
                name="collectedAt"
                required
                value={formData.collectedAt}
                onChange={handleChange}
                className="w-full bg-black/50 border border-secondary/30 p-2 text-white focus:outline-none focus:border-secondary [color-scheme:dark]"
              />
            </div>

            <button 
              type="submit"
              disabled={logUnit.isPending}
              className={cn(
                "w-full py-3 flex items-center justify-center gap-2 uppercase tracking-widest font-bold transition-all",
                logUnit.isPending 
                  ? "bg-secondary/20 text-secondary/50 cursor-not-allowed border border-secondary/30" 
                  : "bg-secondary text-black hover:bg-white hover:text-black border border-secondary shadow-[0_0_15px_rgba(0,212,255,0.4)]"
              )}
            >
              {logUnit.isPending ? "Hashing Block..." : <><Database className="w-4 h-4" /> Seal & Commit to Chain</>}
            </button>
          </form>
        </div>

        <div className="space-y-6 font-mono text-sm">
          <div className="terminal-panel p-6 border border-white/5 bg-[#0a0d14]">
            <h3 className="text-slate-400 uppercase tracking-widest text-xs mb-4 border-b border-white/10 pb-2">Status Output</h3>
            
            {logUnit.isError && (
              <div className="bg-primary/10 border border-primary/30 p-4 text-primary flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold">INDUCTION FAILED</div>
                  <div className="text-xs mt-1 text-primary/70">{(logUnit.error as any)?.message || "Network rejection or invalid donor."}</div>
                </div>
              </div>
            )}

            {successUnit && (
              <div className="bg-cyan-950/30 border border-cyan-500/30 p-4 text-cyan-400 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-cyan-500 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-2">UNIT INDUCTED SECURELY</div>
                  <div className="grid grid-cols-2 gap-y-2 text-[10px] uppercase">
                    <span className="text-cyan-500/60">Unit ID:</span>
                    <span className="text-white font-bold">{successUnit}</span>
                    <span className="text-cyan-500/60">Blood Type:</span>
                    <span className="text-white">{formData.bloodType}</span>
                    <span className="text-cyan-500/60">Hash Ref:</span>
                    <span className="text-white blur-[2px] hover:blur-none transition-all cursor-crosshair truncate block" title="Simulated Hash">0x8f...e3b2</span>
                  </div>
                </div>
              </div>
            )}

            {!logUnit.isError && !successUnit && (
              <div className="text-slate-600 text-center py-8">
                WAITING FOR INPUT...
              </div>
            )}
          </div>
          
          <div className="text-[10px] text-slate-500 uppercase leading-relaxed text-justify">
            NOTICE: Once a unit is inducted, the record is cryptographically sealed onto the Bloodchain ledger. Blood type and Donor ID cannot be modified post-commit. Verify all labels prior to sealing.
          </div>
        </div>
      </div>
    </div>
  );
}
