"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { CreditCard, Upload, X, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
  CURRENCIES,
  CURRENCY_LABELS,
  Currency,
} from "../../../_types/liquidations.types";
import { useAddPayment } from "../../../_hooks/liquidations-hooks";
import {
  addPaymentSchema,
  AddPaymentFormValues,
} from "../../../_schemas/liquidations-schemas";
import { uploadToR2, validateFile } from "@/lib/r2-upload";

interface PaymentFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function PaymentForm({
  liquidationId,
  onSuccess,
  onCancel,
  showActions = true,
}: PaymentFormProps) {
  const addPaymentMutation = useAddPayment(liquidationId);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const form = useForm<AddPaymentFormValues>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: {
      payment_method: "DEBIT",
      amount: "",
      currency: "PEN",
      evidence_url: "",
    },
  });

  const selectedCurrency = form.watch("currency");
  const evidenceUrl = form.watch("evidence_url");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validation = validateFile(file, {
      maxSizeMB: 10,
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    });

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadToR2(file);
      
      if (result.success && result.url) {
        form.setValue("evidence_url", result.url);
        setUploadedFileName(file.name);
        toast.success("Archivo subido correctamente");
      } else {
        toast.error(result.error || "Error al subir el archivo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error al subir el archivo");
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleRemoveEvidence = () => {
    form.setValue("evidence_url", "");
    setUploadedFileName(null);
  };

  const handleSubmit = (data: AddPaymentFormValues) => {
    addPaymentMutation.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          payment_method: data.payment_method,
          amount: Number(data.amount),
          currency: data.currency,
          evidence_url: data.evidence_url || undefined,
        } as Parameters<typeof addPaymentMutation.mutate>[0]["body"],
      },
      {
        onSuccess: () => {
          form.reset();
          setUploadedFileName(null);
          onSuccess?.();
        },
      },
    );
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="size-4 text-red-500" />;
    return <ImageIcon className="size-4 text-blue-500" />;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 px-4"
        id="payment-form"
      >
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Método de Pago</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un método" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {PAYMENT_METHOD_LABELS[method as PaymentMethod]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Monto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Moneda</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {CURRENCY_LABELS[currency as Currency]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Evidence Upload */}
        <FormField
          control={form.control}
          name="evidence_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evidencia de pago (opcional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {!evidenceUrl ? (
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="evidence-upload"
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm transition-colors hover:bg-muted ${
                          isUploading ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <Spinner className="size-4" />
                            <span>Subiendo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="size-4" />
                            <span>Subir imagen o PDF</span>
                          </>
                        )}
                      </label>
                      <input
                        id="evidence-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
                      {uploadedFileName && getFileIcon(uploadedFileName)}
                      <span className="flex-1 truncate text-sm">
                        {uploadedFileName || "Archivo subido"}
                      </span>
                      <CheckCircle className="size-4 text-green-500" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveEvidence}
                        className="size-6 p-0"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Formatos: JPG, PNG, WebP, PDF. Máximo 10MB.
                  </p>
                  <input type="hidden" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showActions && (
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addPaymentMutation.isPending}>
              {addPaymentMutation.isPending && <Spinner className="mr-2" />}
              <CreditCard className="mr-2 size-4" />
              Registrar Pago ({selectedCurrency})
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

export { PaymentForm as default };
