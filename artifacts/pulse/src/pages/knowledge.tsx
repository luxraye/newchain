import { motion } from "framer-motion";
import { ShieldCheck, Clock, HeartPulse, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const COMPATIBILITY: Record<string, string[]> = {
  "O-":  ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+":  ["O+", "A+", "B+", "AB+"],
  "A-":  ["A-", "A+", "AB-", "AB+"],
  "A+":  ["A+", "AB+"],
  "B-":  ["B-", "B+", "AB-", "AB+"],
  "B+":  ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

const BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

const ELIGIBILITY_CRITERIA = [
  { ok: true,  text: "Age 17–65 (with parental consent for 16–17)" },
  { ok: true,  text: "Weight ≥ 50 kg" },
  { ok: true,  text: "Haemoglobin ≥ 12.5 g/dL (female), ≥ 13.0 g/dL (male)" },
  { ok: true,  text: "No donation in the last 12 weeks (whole blood)" },
  { ok: true,  text: "No fever, cold, or infection in the past 14 days" },
  { ok: false, text: "Recent major surgery (< 6 months)" },
  { ok: false, text: "HIV, Hepatitis B or C positive" },
  { ok: false, text: "Pregnancy or delivery in the last 6 months" },
  { ok: false, text: "Malaria in the last 12 months" },
  { ok: false, text: "Intravenous drug use (ever)" },
];

export default function Knowledge() {
  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent border border-border text-sm font-mono text-muted-foreground mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              NBTS CLINICAL GUIDELINES — REV. 4.2
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Eligibility &amp; Guidelines</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              National Blood Transfusion Service eligibility criteria and blood group compatibility reference for Botswana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-2">Donor Eligibility Criteria</h2>
          <p className="text-muted-foreground text-sm mb-8">
            You must meet all of the following criteria to be eligible to donate whole blood.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ELIGIBILITY_CRITERIA.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  item.ok
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-destructive/5 border-destructive/20"
                }`}
              >
                {item.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                )}
                <span className="text-sm text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Timeline */}
      <section className="py-16 border-b border-border bg-accent/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Donation Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                label: "Whole Blood",
                interval: "12 weeks",
                desc: "Standard whole blood donation. Most common type.",
                color: "text-primary",
              },
              {
                icon: HeartPulse,
                label: "Platelets (Apheresis)",
                interval: "2 weeks",
                desc: "Component donation via apheresis machine.",
                color: "text-secondary",
              },
              {
                icon: AlertCircle,
                label: "Plasma",
                interval: "4 weeks",
                desc: "Liquid component, critical for trauma care.",
                color: "text-amber-500",
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <item.icon className={`w-8 h-8 mb-4 ${item.color}`} />
                <h3 className="font-bold mb-1">{item.label}</h3>
                <p className="font-mono text-xl font-bold text-foreground mb-3">{item.interval}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility Matrix */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-2">Blood Group Compatibility Matrix</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Column = Donor type. Row = Recipient type. ✓ = compatible transfusion.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border border-border bg-accent/50 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Recipient ↓ / Donor →
                  </th>
                  {BLOOD_TYPES.map((donor) => (
                    <th key={donor} className="p-3 border border-border bg-accent/50 text-center font-bold text-foreground w-12">
                      {donor}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BLOOD_TYPES.map((recipient) => (
                  <tr key={recipient} className="hover:bg-accent/20 transition-colors">
                    <td className="p-3 border border-border font-bold text-foreground">{recipient}</td>
                    {BLOOD_TYPES.map((donor) => {
                      const compatible = COMPATIBILITY[donor]?.includes(recipient);
                      return (
                        <td key={donor} className="p-3 border border-border text-center">
                          {compatible ? (
                            <span className="text-green-600 font-bold">✓</span>
                          ) : (
                            <span className="text-destructive/30">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-4 font-mono">
            * O- is the universal donor. AB+ is the universal recipient. Always verify ABO/Rh compatibility before transfusion.
          </p>
        </div>
      </section>
    </div>
  );
}
