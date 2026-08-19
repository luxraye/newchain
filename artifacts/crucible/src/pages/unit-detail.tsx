import { useState, useRef } from "react";
import { 
  useGetLabUnitDetail, 
  useSubmitLabScreening, 
  useSeparateLabComponents,
  useTransitionLabUnit,
  getGetLabUnitDetailQueryKey,
  getGetLabWorklistQueryKey,
  getGetLabDashboardQueryKey,
  getGetLabEventsQueryKey,
  LabScreeningInputAboGroup,
  LabScreeningInputRhFactor,
  LabScreeningInputHiv,
  LabScreeningInputHepatitisB,
  LabScreeningInputHepatitisC,
  LabScreeningInputMalaria,
  LabScreeningInputSyphilis,
  LabComponentInputType,
  LabTransitionInputStage
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { StageBadge, RiskBadge, BloodTypeBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Activity, 
  AlertTriangle, 
  Microscope,
  Box,
  Fingerprint,
  Thermometer,
  Clock,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Check,
  Plus,
  Trash2
} from "lucide-react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const screeningSchema = z.object({
  operatorName: z.string().min(2, "Required"),
  aboGroup: z.nativeEnum(LabScreeningInputAboGroup),
  rhFactor: z.nativeEnum(LabScreeningInputRhFactor),
  hiv: z.nativeEnum(LabScreeningInputHiv),
  hepatitisB: z.nativeEnum(LabScreeningInputHepatitisB),
  hepatitisC: z.nativeEnum(LabScreeningInputHepatitisC),
  malaria: z.nativeEnum(LabScreeningInputMalaria),
  syphilis: z.nativeEnum(LabScreeningInputSyphilis),
  notes: z.string().optional()
});

const componentSchema = z.object({
  operatorName: z.string().min(2, "Required"),
  notes: z.string().optional(),
  components: z.array(z.object({
    type: z.nativeEnum(LabComponentInputType),
    volumeMl: z.coerce.number().min(1, "Required")
  })).min(1, "Add at least one component")
});

const transitionSchema = z.object({
  operatorName: z.string().min(2, "Required"),
  stage: z.nativeEnum(LabTransitionInputStage),
  reason: z.string().optional()
});

export default function UnitDetail({ facilityId }: { facilityId: string }) {
  const { unitId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useGetLabUnitDetail(unitId || "");
  
  const screeningMutation = useSubmitLabScreening();
  const separationMutation = useSeparateLabComponents();
  const transitionMutation = useTransitionLabUnit();

  const screeningForm = useForm<z.infer<typeof screeningSchema>>({
    resolver: zodResolver(screeningSchema),
    defaultValues: {
      operatorName: "TECH-01",
      aboGroup: LabScreeningInputAboGroup.O,
      rhFactor: LabScreeningInputRhFactor.positive,
      hiv: LabScreeningInputHiv.pending,
      hepatitisB: LabScreeningInputHepatitisB.pending,
      hepatitisC: LabScreeningInputHepatitisC.pending,
      malaria: LabScreeningInputMalaria.pending,
      syphilis: LabScreeningInputSyphilis.pending,
      notes: ""
    }
  });

  const componentForm = useForm<z.infer<typeof componentSchema>>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      operatorName: "TECH-01",
      components: [{ type: LabComponentInputType.red_cells, volumeMl: 250 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: componentForm.control,
    name: "components"
  });

  const transitionForm = useForm<z.infer<typeof transitionSchema>>({
    resolver: zodResolver(transitionSchema),
    defaultValues: {
      operatorName: "TECH-01",
      stage: LabTransitionInputStage.quarantine,
      reason: ""
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-muted-foreground">
        <Activity className="h-8 w-8 animate-pulse mb-4" />
        <p>Loading unit processing record...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-9 w-9 text-destructive mb-4" />
        <h2 className="text-lg font-semibold">Unable to load this unit</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          The processing record may be unavailable or no longer accessible.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: getGetLabUnitDetailQueryKey(unitId || "") });
    queryClient.invalidateQueries({ queryKey: getGetLabWorklistQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetLabDashboardQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetLabWorklistQueryKey({ facilityId }) });
    queryClient.invalidateQueries({ queryKey: getGetLabDashboardQueryKey({ facilityId }) });
    queryClient.invalidateQueries({ queryKey: getGetLabEventsQueryKey() });
  };

  const onSubmitScreening = (values: z.infer<typeof screeningSchema>) => {
    screeningMutation.mutate({ unitId: unitId!, data: values }, {
      onSuccess: () => {
        toast({ title: "Screening logged successfully" });
        invalidateCache();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to log screening" });
      }
    });
  };

  const onSubmitComponents = (values: z.infer<typeof componentSchema>) => {
    separationMutation.mutate({ unitId: unitId!, data: values }, {
      onSuccess: () => {
        toast({ title: "Components separated successfully" });
        invalidateCache();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to separate components" });
      }
    });
  };

  const onSubmitTransition = (values: z.infer<typeof transitionSchema>) => {
    transitionMutation.mutate({ unitId: unitId!, data: values }, {
      onSuccess: () => {
        toast({ title: `Unit transitioned to ${values.stage}` });
        invalidateCache();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to transition unit" });
      }
    });
  };

  const isTerminal = data.stage === "released" || data.stage === "discarded";
  const isExpired = new Date(data.expiresAt) <= new Date();

  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto">
      <div>
        <Link href="/worklist" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Worklist
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-mono">{data.unitId}</h2>
            <div className="flex items-center gap-3 mt-2">
              <BloodTypeBadge type={data.bloodType} />
              <StageBadge stage={data.stage} />
              <RiskBadge status={data.riskStatus} />
            </div>
          </div>
          
          {!isTerminal && !isExpired ? (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Quarantine
                </Button>
              </DialogTrigger>
              <DialogContent className="border-purple-500/30">
                <DialogHeader>
                  <DialogTitle>Quarantine Unit</DialogTitle>
                  <DialogDescription>Move this unit to quarantine for further review.</DialogDescription>
                </DialogHeader>
                <Form {...transitionForm}>
                  <form onSubmit={transitionForm.handleSubmit((v) => onSubmitTransition({...v, stage: LabTransitionInputStage.quarantine}))} className="space-y-4">
                    <FormField control={transitionForm.control} name="operatorName" render={({field}) => (
                      <FormItem><FormLabel>Operator ID</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={transitionForm.control} name="reason" render={({field}) => (
                      <FormItem><FormLabel>Reason</FormLabel><FormControl><Input {...field} placeholder="Why is this quarantined?" /></FormControl></FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={transitionMutation.isPending}>
                      Confirm Quarantine
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Release
                </Button>
              </DialogTrigger>
              <DialogContent className="border-emerald-500/30">
                <DialogHeader>
                  <DialogTitle>Release Unit</DialogTitle>
                  <DialogDescription>Mark unit as safe and ready for inventory/distribution.</DialogDescription>
                </DialogHeader>
                <Form {...transitionForm}>
                  <form onSubmit={transitionForm.handleSubmit((v) => onSubmitTransition({...v, stage: LabTransitionInputStage.released}))} className="space-y-4">
                    <FormField control={transitionForm.control} name="operatorName" render={({field}) => (
                      <FormItem><FormLabel>Operator ID</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={transitionMutation.isPending}>
                      Release Products
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                  <Ban className="mr-2 h-4 w-4" /> Discard
                </Button>
              </DialogTrigger>
              <DialogContent className="border-red-500/30">
                <DialogHeader>
                  <DialogTitle>Discard Unit</DialogTitle>
                  <DialogDescription>Permanently discard this unit and its components.</DialogDescription>
                </DialogHeader>
                <Form {...transitionForm}>
                  <form onSubmit={transitionForm.handleSubmit((v) => onSubmitTransition({...v, stage: LabTransitionInputStage.discarded}))} className="space-y-4">
                    <FormField control={transitionForm.control} name="operatorName" render={({field}) => (
                      <FormItem><FormLabel>Operator ID</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={transitionForm.control} name="reason" render={({field}) => (
                      <FormItem><FormLabel>Reason for discard</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <Button type="submit" variant="destructive" className="w-full" disabled={transitionMutation.isPending}>
                      Confirm Discard
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          ) : (
            <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              {isExpired
                ? "This unit is expired. Laboratory actions are locked."
                : `This unit is ${data.stage}. The laboratory record is read-only.`}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-md p-4 bg-card">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Fingerprint className="h-3 w-3" /> Donor ID</div>
          <div className="font-mono">{data.donorId}</div>
        </div>
        <div className="border rounded-md p-4 bg-card">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp (C)</div>
          <div className="font-mono">{data.temperature || "N/A"}°</div>
        </div>
        <div className="border rounded-md p-4 bg-card">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Collected</div>
          <div className="font-mono">{new Date(data.collectedAt).toLocaleDateString()}</div>
        </div>
        <div className="border rounded-md p-4 bg-card">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Expires</div>
          <div className="font-mono text-red-400">{new Date(data.expiresAt).toLocaleDateString()}</div>
        </div>
      </div>

      <Tabs defaultValue="screening" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-muted max-w-md">
          <TabsTrigger value="screening">Screening</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="screening" className="flex-1 mt-4 border rounded-md bg-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Microscope className="h-5 w-5 text-primary" />
            Infectious Disease & Typing
          </h3>
          
          {data.screening ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">ABO Group</div>
                  <div className="font-mono text-lg">{data.screening.aboGroup}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Rh Factor</div>
                  <div className="font-mono text-lg">{data.screening.rhFactor}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Operator</div>
                  <div className="font-mono text-lg">{data.screening.operatorName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="font-mono text-sm mt-1">{new Date(data.screening.screenedAt).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Serology Results</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['hiv', 'hepatitisB', 'hepatitisC', 'malaria', 'syphilis'].map(test => {
                    const result = (data.screening as any)[test];
                    const isPositive = result === 'positive';
                    return (
                      <div key={test} className={`p-3 border rounded-md ${isPositive ? 'border-red-500/50 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
                        <div className="text-xs uppercase tracking-wider mb-1 opacity-70">{test.replace('hepatitis', 'Hep ')}</div>
                        <div className={`font-bold flex items-center gap-2 ${isPositive ? 'text-red-500' : 'text-emerald-500'}`}>
                          {isPositive ? <AlertTriangle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {result.toUpperCase()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <Form {...screeningForm}>
              <form onSubmit={screeningForm.handleSubmit(onSubmitScreening)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md border-primary/20 bg-primary/5">
                  <FormField control={screeningForm.control} name="aboGroup" render={({field}) => (
                    <FormItem>
                      <FormLabel>ABO Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="O">O</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={screeningForm.control} name="rhFactor" render={({field}) => (
                    <FormItem>
                      <FormLabel>Rh Factor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="positive">Positive (+)</SelectItem>
                          <SelectItem value="negative">Negative (-)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['hiv', 'hepatitisB', 'hepatitisC', 'malaria', 'syphilis'].map((testName) => (
                    <FormField key={testName} control={screeningForm.control} name={testName as any} render={({field}) => (
                      <FormItem>
                        <FormLabel className="uppercase text-[10px] tracking-wider">{testName.replace('hepatitis', 'Hep ')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="negative" className="text-emerald-500">Negative</SelectItem>
                            <SelectItem value="positive" className="text-red-500">Positive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={screeningForm.control} name="operatorName" render={({field}) => (
                    <FormItem>
                      <FormLabel>Operator ID</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={screeningForm.control} name="notes" render={({field}) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
                
                <Button type="submit" className="w-full md:w-auto" disabled={screeningMutation.isPending}>
                  Save Screening Results
                </Button>
              </form>
            </Form>
          )}
        </TabsContent>

        <TabsContent value="components" className="flex-1 mt-4 border rounded-md bg-card p-6">
           <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            Component Separation
          </h3>

          {data.components && data.components.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.components.map(comp => (
                  <div key={comp.componentId} className="border p-4 rounded-md relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{comp.type.replace('_', ' ')}</div>
                    <div className="font-mono text-lg mb-2">{comp.volumeMl} mL</div>
                    <div className="flex justify-between items-center text-xs">
                      <StageBadge stage={comp.status} />
                      <span className="text-muted-foreground font-mono" title={comp.componentId}>{comp.componentId.substring(0, 8)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Form {...componentForm}>
              <form onSubmit={componentForm.handleSubmit(onSubmitComponents)} className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md bg-muted/20">
                      <FormField control={componentForm.control} name={`components.${index}.type`} render={({field}) => (
                        <FormItem className="flex-1">
                          <FormLabel>Component Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="red_cells">Red Blood Cells</SelectItem>
                              <SelectItem value="plasma">Plasma</SelectItem>
                              <SelectItem value="platelets">Platelets</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={componentForm.control} name={`components.${index}.volumeMl`} render={({field}) => (
                        <FormItem className="flex-1">
                          <FormLabel>Volume (mL)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => append({ type: LabComponentInputType.plasma, volumeMl: 250 })} className="w-full border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Add Component
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <FormField control={componentForm.control} name="operatorName" render={({field}) => (
                    <FormItem>
                      <FormLabel>Operator ID</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
                
                <Button type="submit" disabled={separationMutation.isPending}>
                  Process Separation
                </Button>
              </form>
            </Form>
          )}
        </TabsContent>

        <TabsContent value="audit" className="flex-1 mt-4 border rounded-md bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium text-right">Chain Hash</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {data.events.map((event) => (
                  <tr key={event.eventId} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-sans font-medium">{event.action}</td>
                    <td className="px-4 py-3 text-foreground">{event.actor}</td>
                    <td className="px-4 py-3 text-muted-foreground font-sans italic">
                      {event.reason || "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground/50 text-xs">
                      {event.chainHash.substring(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
