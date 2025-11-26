"use client";

import { Building, CreditCard, FileText, Globe, IdCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getIdDocumentTypeBadgeClasses,
  getIdDocumentTypeConfig,
  getIdDocumentTypeIconClasses,
  getIdDocumentTypeLabel,
} from "../../_utils/id-document-types";

interface IdDocumentTypeBadgeProps {
  idDocumentType: string | null | undefined;
  showIcon?: boolean;
  className?: string;
}

/**
 * Componente Badge reutilizable para mostrar tipos de documentos con iconos y colores
 * Usa las utilidades de id-document-types para mantener consistencia
 */
export function IdDocumentTypeBadge({
  idDocumentType,
  showIcon = true,
  className,
}: IdDocumentTypeBadgeProps) {
  const config = getIdDocumentTypeConfig(idDocumentType);
  const iconClasses = getIdDocumentTypeIconClasses(idDocumentType);
  const badgeClasses = getIdDocumentTypeBadgeClasses(idDocumentType, className);
  const label = getIdDocumentTypeLabel(idDocumentType);

  // Renderizar el icono correcto
  const iconMap = new Map([
    [IdCard, IdCard],
    [Building, Building],
    [Globe, Globe],
    [CreditCard, CreditCard],
    [FileText, FileText],
  ]);

  const IconComponent = iconMap.get(config.icon) ?? FileText;

  return (
    <Badge variant="outline" className={badgeClasses}>
      {showIcon && <IconComponent className={cn(iconClasses, "h-4 w-4")} />}
      {label}
    </Badge>
  );
}
