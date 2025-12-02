import { z } from "zod";

// Helper para validar que un string es un número válido
const numericString = (message: string, min = 0) =>
  z.coerce.number().min(1, { message }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= min,
    { message: `Debe ser un número ${min > 0 ? `mayor a ${min}` : "mayor o igual a 0"}.` }
  );

// Schema de validación para crear liquidación
export const createLiquidationSchema = z.object({
  customer_id: numericString("Seleccione un cliente.", 1),

  staff_id: numericString("Seleccione un personal a cargo.", 1),

  currency_rate: z.coerce.number().min(0.01, { message: "El tipo de cambio es requerido." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0.01,
    { message: "El tipo de cambio debe ser mayor a 0." }
  ),

  payment_deadline: z.string().min(1, {
    message: "La fecha límite de pago es requerida.",
  }),

  companion: z.string().min(1, { message: "El número de acompañantes es requerido." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "El número de acompañantes debe ser 0 o mayor." }
  ),
});

// Schema para agregar pago
export const addPaymentSchema = z.object({
  payment_method: z.enum(["DEBIT", "CREDIT", "YAPE", "OTHER"], {
    message: "Seleccione un método de pago.",
  }),

  amount: z.string().min(1, { message: "El monto es requerido." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0.01,
    { message: "El monto debe ser mayor a 0." }
  ),

  currency: z.enum(["PEN", "USD"], {
    message: "Seleccione una moneda.",
  }),
});

// Schema para agregar incidencia
export const addIncidencySchema = z.object({
  reason: z.string().min(1, {
    message: "El motivo es requerido.",
  }),

  amount: z.string().optional(),

  incidencyDate: z.string().min(1, {
    message: "La fecha de incidencia es requerida.",
  }),
});

// Schema para agregar servicio de tour
export const addTourServiceSchema = z.object({
  tariff_rate: z.string().min(1, { message: "La tarifa es requerida." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "La tarifa debe ser 0 o mayor." }
  ),

  is_taxed: z.boolean(),

  currency: z.enum(["PEN", "USD"], {
    message: "Seleccione una moneda.",
  }),

  tours: z
    .array(
      z.object({
        start_date: z.string().min(1, { message: "Fecha inicio requerida." }),
        end_date: z.string().min(1, { message: "Fecha fin requerida." }),
        title: z.string().min(1, { message: "Título requerido." }),
        price: z.string(),
        place: z.string().min(1, { message: "Lugar requerido." }),
        currency: z.string(),
        status: z.string(),
      }),
    )
    .min(1, { message: "Agregue al menos un tour." }),
});

// Schema para agregar servicio de hotel
export const addHotelServiceSchema = z.object({
  tariff_rate: z.string().min(1, { message: "La tarifa es requerida." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "La tarifa debe ser 0 o mayor." }
  ),

  is_taxed: z.boolean(),

  currency: z.enum(["PEN", "USD"], {
    message: "Seleccione una moneda.",
  }),

  hotel_bookings: z
    .array(
      z.object({
        check_in: z.string().min(1, { message: "Check-in requerido." }),
        check_out: z.string().min(1, { message: "Check-out requerido." }),
        hotel: z.string().min(1, { message: "Hotel requerido." }),
        room: z.string().min(1, { message: "Habitación requerida." }),
        room_description: z.string().optional(),
        price_by_night: z.string(),
        currency: z.string(),
        status: z.string(),
      }),
    )
    .min(1, { message: "Agregue al menos una reserva de hotel." }),
});

// Schema para agregar servicio de vuelo
export const addFlightServiceSchema = z.object({
  tariff_rate: z.string().min(1, { message: "La tarifa es requerida." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "La tarifa debe ser 0 o mayor." }
  ),

  is_taxed: z.boolean(),

  currency: z.enum(["PEN", "USD"], {
    message: "Seleccione una moneda.",
  }),

  flight_bookings: z
    .array(
      z.object({
        origin: z.string().min(1, { message: "Origen requerido." }),
        destiny: z.string().min(1, { message: "Destino requerido." }),
        departure_date: z.string().min(1, { message: "Fecha salida requerida." }),
        arrival_date: z.string().min(1, { message: "Fecha llegada requerida." }),
        aeroline: z.string().min(1, { message: "Aerolínea requerida." }),
        aeroline_booking_code: z.string().min(1, { message: "Código reserva aerolínea requerido." }),
        costamar_booking_code: z.string().optional(),
        tkt_numbers: z.string().min(1, { message: "Números de ticket requeridos." }),
        status: z.string(),
        total_price: z.string(),
        currency: z.string(),
      }),
    )
    .min(1, { message: "Agregue al menos una reserva de vuelo." }),
});

// Schema para agregar servicio adicional
export const addAdditionalServiceSchema = z.object({
  tariff_rate: z.string().min(1, { message: "La tarifa es requerida." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "La tarifa debe ser 0 o mayor." }
  ),

  is_taxed: z.boolean(),

  currency: z.enum(["PEN", "USD"], {
    message: "Seleccione una moneda.",
  }),

  price: z.string().min(1, { message: "El precio es requerido." }).refine(
    (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
    { message: "El precio debe ser 0 o mayor." }
  ),

  status: z.enum(["PENDING", "COMPLETED", "CANCELED"], {
    message: "Seleccione un estado.",
  }),
});

export type CreateLiquidationFormValues = z.infer<typeof createLiquidationSchema>;
export type AddPaymentFormValues = z.infer<typeof addPaymentSchema>;
export type AddIncidencyFormValues = z.infer<typeof addIncidencySchema>;
export type AddTourServiceFormValues = z.infer<typeof addTourServiceSchema>;
export type AddHotelServiceFormValues = z.infer<typeof addHotelServiceSchema>;
export type AddFlightServiceFormValues = z.infer<typeof addFlightServiceSchema>;
export type AddAdditionalServiceFormValues = z.infer<typeof addAdditionalServiceSchema>;
