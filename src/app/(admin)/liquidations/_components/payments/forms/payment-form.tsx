"use client";

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
import { CreditCard } from "lucide-react";
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

  const form = useForm<AddPaymentFormValues>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: {
      payment_method: "DEBIT",
      amount: "",
      currency: "PEN",
    },
  });

  const selectedCurrency = form.watch("currency");

  const handleSubmit = (data: AddPaymentFormValues) => {
    addPaymentMutation.mutate(
      {
        params: { path: { liquidationId } },
        body: {
          payment_method: data.payment_method,
          amount: Number(data.amount),
          currency: data.currency,
        } as Parameters<typeof addPaymentMutation.mutate>[0]["body"],
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      },
    );
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
