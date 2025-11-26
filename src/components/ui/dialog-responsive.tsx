"use client";

import { AlertCircle } from "lucide-react";
import * as React from "react";
import {
  Dialog as DesktopDialog,
  DialogClose as DesktopDialogClose,
  DialogContent as DesktopDialogContent,
  DialogDescription as DesktopDialogDescription,
  DialogFooter as DesktopDialogFooter,
  DialogHeader as DesktopDialogHeader,
  DialogOverlay as DesktopDialogOverlay,
  DialogPortal as DesktopDialogPortal,
  DialogTitle as DesktopDialogTitle,
  DialogTrigger as DesktopDialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { Spinner } from "./spinner";

// Root — delegate to drawer/dialog based on screen size
function Dialog(props: React.ComponentProps<typeof DesktopDialog>) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <Drawer {...props} />;
  }
  return <DesktopDialog {...props} />;
}

// Trigger — delegate to drawer/dialog trigger
function DialogTrigger(
  props: React.ComponentProps<typeof DesktopDialogTrigger>,
) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerTrigger {...props} />;
  }
  return <DesktopDialogTrigger {...props} />;
}

// Close — delegate to drawer/dialog
function DialogClose(props: React.ComponentProps<typeof DesktopDialogClose>) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerClose {...props} />;
  }
  return <DesktopDialogClose {...props} />;
}

// Portal — reuse desktop portal (drawer handles its own portal in DrawerContent)
const DialogPortal = DesktopDialogPortal;

// Overlay — reuse desktop overlay for consistency
const DialogOverlay = DesktopDialogOverlay;

// Content
function DialogContent({
  className,
  children,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof DesktopDialogContent> & {
  showCloseButton?: boolean;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerContent className={className} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DesktopDialogContent
      className={cn("px-0", className)}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </DesktopDialogContent>
  );
}

// Header — delegate to drawer/dialog header
function DialogHeader(props: React.ComponentProps<typeof DesktopDialogHeader>) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerHeader {...props} />;
  }
  return <DesktopDialogHeader className="px-4" {...props} />;
}

// Footer — delegate to drawer/dialog footer
function DialogFooter(props: React.ComponentProps<typeof DesktopDialogFooter>) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerFooter {...props} />;
  }
  return <DesktopDialogFooter {...props} className="px-4" />;
}

// Title — delegate to drawer/dialog title
function DialogTitle(props: React.ComponentProps<typeof DesktopDialogTitle>) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerTitle {...props} />;
  }
  return <DesktopDialogTitle {...props} />;
}

// Description — delegate to drawer/dialog description
function DialogDescription(
  props: React.ComponentProps<typeof DesktopDialogDescription>,
) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <DrawerDescription {...props} />;
  }
  return <DesktopDialogDescription {...props} />;
}

// ScrollArea — delegate to scroll area
function DialogScrollArea({
  className,
  ...props
}: React.ComponentProps<typeof ScrollArea>) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <ScrollArea
        className={cn("h-[calc(100dvh-300px)]", className)}
        {...props}
      >
        {props.children}
      </ScrollArea>
    );
  }
  return (
    <ScrollArea className={cn("h-[calc(100dvh-200px)]", className)} {...props}>
      {props.children}
    </ScrollArea>
  );
}

// Tipos para los componentes de diálogo
interface DialogContentComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

interface DialogStateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

// Componente base para diálogos con contenido
function DialogContentComponent({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: DialogContentComponentProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("px-0", className)}>
        <DialogHeader className="px-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

// Componente para estado de carga
function DialogLoading({
  open,
  onOpenChange,
  title = "Cargando...",
  description = "Espera un momento mientras cargamos la información.",
  children = <span>Cargando...</span>,
}: DialogStateProps) {
  return (
    <DialogContentComponent
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <div className="flex items-center justify-center py-8 gap-2">
        <Spinner />
        {children}
      </div>
    </DialogContentComponent>
  );
}

// Componente para estado de error
function DialogError({
  open,
  onOpenChange,
  title = "Error",
  description = "Ha ocurrido un error mientras cargamos la información.",
  children = <span>Error desconocido</span>,
}: DialogStateProps) {
  return (
    <DialogContentComponent
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <div className="flex items-center justify-center py-8 gap-2">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
        {children}
      </div>
    </DialogContentComponent>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogScrollArea,
  DialogTitle,
  DialogTrigger,
  DialogContentComponent,
  DialogLoading,
  DialogError,
};
