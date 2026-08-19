import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck, MapPin, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterDonor, Donor } from "@workspace/api-client-react";

const formSchema = z.object({
  name: z.string().min(2, "Legal name must be at least 2 characters"),
  idNumber: z.string().min(9, "ID number must be 9 digits").max(9),
  phone: z.string().min(8, "Valid contact number required for urgent requests"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  bloodType: z.string().min(1, "Blood phenotype is strictly required"),
  district: z.string().min(1, "Primary operating district is required"),
});

const DISTRICTS = [
  "Gaborone", "Francistown", "Maun", "Molepolole", "Serowe", "Kanye", "Mahalapye"
];
const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export default function Register({ onComplete }: { onComplete: (donor: Donor) => void }) {
  const [, setLocation] = useLocation();
  const [success, setSuccess] = useState(false);
  const [registeredDonor, setRegisteredDonor] = useState<Donor | null>(null);
  
  const registerMutation = useRegisterDonor();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      idNumber: "",
      phone: "",
      email: "",
      bloodType: "",
      district: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerMutation.mutate({
      data: {
        name: values.name,
        phone: values.phone,
        idNumber: values.idNumber,
        email: values.email,
        bloodType: values.bloodType,
        district: values.district,
      }
    }, {
      onSuccess: (data) => {
        setRegisteredDonor(data);
        setSuccess(true);
        setTimeout(() => {
          onComplete(data);
          setLocation("/dashboard");
        }, 2500);
      }
    });
  }

  if (success && registeredDonor) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-background bg-dots-pattern">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-card border border-border shadow-md rounded-lg p-10 text-center"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Registration Confirmed</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Identity verified. Health profile established for <strong>{registeredDonor.name}</strong>.
          </p>
          <div className="bg-accent p-4 rounded-md border border-border/50 mb-8 text-left">
            <p className="text-xs text-muted-foreground font-mono mb-1">ASSIGNED DONOR ID</p>
            <p className="font-mono text-lg font-bold">{registeredDonor.donorId}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Initializing secure dashboard...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background bg-dots-pattern">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Instructions Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Donor Registration</h1>
              <p className="text-muted-foreground text-sm">Official Intake Form · Form Rev. 4.2</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 border-b border-border pb-3">
                <AlertCircle className="w-4 h-4 text-primary" />
                Intake Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-primary text-xs mt-0.5">01</span>
                  Provide legal identification matching your Omang or Passport.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-primary text-xs mt-0.5">02</span>
                  Accurate blood typing ensures safe routing of your donation. If unknown, select 'Unknown' (requires blood draw at facility).
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-primary text-xs mt-0.5">03</span>
                  Your primary district helps local facilities notify you of critical shortages.
                </li>
              </ul>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-accent/50 px-8 py-4 border-b border-border flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold text-sm">Clinical Profile Details</h2>
              </div>
              
              <div className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Legal Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. Tefo Modise" className="bg-background focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Gov. ID / Omang</FormLabel>
                            <FormControl>
                              <Input placeholder="9-digit identification" className="bg-background font-mono focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Mobile Contact</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. 71234567" className="bg-background font-mono focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email Address (Optional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="For clinical updates" className="bg-background focus-visible:ring-primary" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="h-px bg-border my-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> Operating District
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background focus:ring-primary">
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DISTRICTS.map(d => (
                                  <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">Used for local shortage routing.</FormDescription>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 block">
                              Phenotype / Blood Group
                            </FormLabel>
                            <div className="grid grid-cols-4 gap-2">
                              {BLOOD_TYPES.map(type => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => field.onChange(type)}
                                  className={`h-10 rounded text-sm font-mono font-bold transition-all border ${
                                    field.value === type 
                                      ? "bg-primary text-primary-foreground border-primary" 
                                      : "bg-background border-border hover:border-primary/50 text-foreground"
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                            <FormMessage className="text-xs mt-2" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-accent/30 border border-border rounded-md p-4 flex gap-3 items-start">
                      <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        By submitting this form, you acknowledge that your data will be securely stored on the National Bloodchain Ledger. Health records are immutable and strictly protected under clinical data privacy laws.
                      </p>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full md:w-auto min-w-[200px] h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        disabled={registerMutation.isPending}
                        data-testid="btn-submit-register"
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Establish Profile"
                        )}
                      </Button>
                    </div>

                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
