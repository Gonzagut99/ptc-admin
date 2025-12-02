// Tipos de notificación
export type NotificationType =
  | 'LIQUIDATION_CREATED'
  | 'LIQUIDATION_STATUS_UPDATED'
  | 'LIQUIDATION_PAYMENT_STATUS_UPDATED'
  | 'LIQUIDATION_DELETED'
  | 'PAYMENT_ADDED'
  | 'PAYMENT_UPDATED'
  | 'PAYMENT_DELETED'
  | 'SERVICE_ADDED'
  | 'SERVICE_UPDATED'
  | 'SERVICE_DELETED'
  | 'INCIDENCY_ADDED'
  | 'INCIDENCY_UPDATED'
  | 'INCIDENCY_DELETED'
  | 'CUSTOMER_CREATED'
  | 'CUSTOMER_UPDATED'
  | 'CUSTOMER_DELETED'
  | 'STAFF_CREATED'
  | 'STAFF_UPDATED'
  | 'STAFF_DELETED'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'SYSTEM_INFO'
  | 'SYSTEM_WARNING'
  | 'SYSTEM_ERROR';

export type NotificationScope = 'ALL' | 'SELF' | 'OTHERS';

export interface DNotification {
  id: number;
  title: string | null;
  message: string;
  type: NotificationType;
  scope: NotificationScope;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface DUserNotification {
  id: number;
  read: boolean;
  userId: number;
  notificationId: number;
  notification: DNotification;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PaginatedNotifications {
  content: DUserNotification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Helpers para traducir tipos de notificación
export const notificationTypeLabels: Record<NotificationType, string> = {
  LIQUIDATION_CREATED: 'Liquidación creada',
  LIQUIDATION_STATUS_UPDATED: 'Estado de liquidación actualizado',
  LIQUIDATION_PAYMENT_STATUS_UPDATED: 'Estado de pago actualizado',
  LIQUIDATION_DELETED: 'Liquidación eliminada',
  PAYMENT_ADDED: 'Pago agregado',
  PAYMENT_UPDATED: 'Pago actualizado',
  PAYMENT_DELETED: 'Pago eliminado',
  SERVICE_ADDED: 'Servicio agregado',
  SERVICE_UPDATED: 'Servicio actualizado',
  SERVICE_DELETED: 'Servicio eliminado',
  INCIDENCY_ADDED: 'Incidencia agregada',
  INCIDENCY_UPDATED: 'Incidencia actualizada',
  INCIDENCY_DELETED: 'Incidencia eliminada',
  CUSTOMER_CREATED: 'Cliente creado',
  CUSTOMER_UPDATED: 'Cliente actualizado',
  CUSTOMER_DELETED: 'Cliente eliminado',
  STAFF_CREATED: 'Personal creado',
  STAFF_UPDATED: 'Personal actualizado',
  STAFF_DELETED: 'Personal eliminado',
  USER_CREATED: 'Usuario creado',
  USER_UPDATED: 'Usuario actualizado',
  USER_DELETED: 'Usuario eliminado',
  SYSTEM_INFO: 'Información del sistema',
  SYSTEM_WARNING: 'Advertencia del sistema',
  SYSTEM_ERROR: 'Error del sistema',
};

// Colores para los tipos de notificación
export const notificationTypeColors: Record<NotificationType, string> = {
  LIQUIDATION_CREATED: 'bg-green-100 text-green-800',
  LIQUIDATION_STATUS_UPDATED: 'bg-blue-100 text-blue-800',
  LIQUIDATION_PAYMENT_STATUS_UPDATED: 'bg-purple-100 text-purple-800',
  LIQUIDATION_DELETED: 'bg-red-100 text-red-800',
  PAYMENT_ADDED: 'bg-emerald-100 text-emerald-800',
  PAYMENT_UPDATED: 'bg-cyan-100 text-cyan-800',
  PAYMENT_DELETED: 'bg-red-100 text-red-800',
  SERVICE_ADDED: 'bg-indigo-100 text-indigo-800',
  SERVICE_UPDATED: 'bg-violet-100 text-violet-800',
  SERVICE_DELETED: 'bg-red-100 text-red-800',
  INCIDENCY_ADDED: 'bg-amber-100 text-amber-800',
  INCIDENCY_UPDATED: 'bg-yellow-100 text-yellow-800',
  INCIDENCY_DELETED: 'bg-red-100 text-red-800',
  CUSTOMER_CREATED: 'bg-teal-100 text-teal-800',
  CUSTOMER_UPDATED: 'bg-sky-100 text-sky-800',
  CUSTOMER_DELETED: 'bg-red-100 text-red-800',
  STAFF_CREATED: 'bg-lime-100 text-lime-800',
  STAFF_UPDATED: 'bg-green-100 text-green-800',
  STAFF_DELETED: 'bg-red-100 text-red-800',
  USER_CREATED: 'bg-blue-100 text-blue-800',
  USER_UPDATED: 'bg-slate-100 text-slate-800',
  USER_DELETED: 'bg-red-100 text-red-800',
  SYSTEM_INFO: 'bg-gray-100 text-gray-800',
  SYSTEM_WARNING: 'bg-orange-100 text-orange-800',
  SYSTEM_ERROR: 'bg-red-100 text-red-800',
};

// Iconos para categorías de notificación
export type NotificationCategory = 'LIQUIDATION' | 'PAYMENT' | 'SERVICE' | 'INCIDENCY' | 'CUSTOMER' | 'STAFF' | 'USER' | 'SYSTEM';

export function getNotificationCategory(type: NotificationType): NotificationCategory {
  if (type.startsWith('LIQUIDATION_')) return 'LIQUIDATION';
  if (type.startsWith('PAYMENT_')) return 'PAYMENT';
  if (type.startsWith('SERVICE_')) return 'SERVICE';
  if (type.startsWith('INCIDENCY_')) return 'INCIDENCY';
  if (type.startsWith('CUSTOMER_')) return 'CUSTOMER';
  if (type.startsWith('STAFF_')) return 'STAFF';
  if (type.startsWith('USER_')) return 'USER';
  return 'SYSTEM';
}
