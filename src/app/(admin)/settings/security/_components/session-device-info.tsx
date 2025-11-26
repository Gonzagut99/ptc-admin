"use client";

import {
  Globe,
  Laptop,
  type LucideIcon,
  Monitor,
  Smartphone,
} from "lucide-react";
import { UAParser } from "ua-parser-js";

interface SessionDeviceInfoProps {
  userAgent: string | null | undefined;
  ipAddress: string | null | undefined;
  updatedAt: string;
  formatTime: (date: string) => string;
}

interface DeviceInfo {
  icon: LucideIcon;
  browserName: string;
  osName: string;
  deviceType: string;
}

function getDeviceInfo(userAgent: string | null | undefined): DeviceInfo {
  if (!userAgent) {
    return {
      icon: Globe,
      browserName: "Navegador desconocido",
      osName: "Sistema desconocido",
      deviceType: "Dispositivo desconocido",
    };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determinar el tipo de dispositivo e icono
  let icon: LucideIcon = Monitor;
  let deviceType = "Computadora";

  if (result.device.type === "mobile") {
    icon = Smartphone;
    deviceType = "Móvil";
  } else if (result.device.type === "tablet") {
    icon = Smartphone;
    deviceType = "Tablet";
  } else if (result.device.type) {
    icon = Laptop;
    deviceType = "Dispositivo";
  }

  // Obtener información del navegador y OS
  const browserName = result.browser.name || "Navegador desconocido";
  const osName = result.os.name || "Sistema desconocido";

  return {
    icon,
    browserName,
    osName,
    deviceType,
  };
}

export default function SessionDeviceInfo({
  userAgent,
  ipAddress,
  updatedAt,
  formatTime,
}: SessionDeviceInfoProps) {
  const deviceInfo = getDeviceInfo(userAgent);
  const Icon = deviceInfo.icon;

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="shrink-0">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="size-5 text-primary" />
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="font-medium">{deviceInfo.browserName}</div>
          <div className="text-sm text-muted-foreground">
            {deviceInfo.osName} • {deviceInfo.deviceType}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            <span>{ipAddress || "IP desconocida"}</span>
            <span>•</span>
            <span>{formatTime(updatedAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:ml-4">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">Sesión activa</span>
        </div>
      </div>
    </div>
  );
}
