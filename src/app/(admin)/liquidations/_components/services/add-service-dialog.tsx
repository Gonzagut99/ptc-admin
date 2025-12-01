"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Hotel, MapPin, Package } from "lucide-react";
import { LiquidationWithDetailsDto } from "../../_types/liquidations.types";
import {
  TourServiceForm,
  HotelServiceForm,
  FlightServiceForm,
  AdditionalServiceForm,
} from "./forms";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liquidation: LiquidationWithDetailsDto;
}

export default function AddServiceDialog({
  open,
  onOpenChange,
  liquidation,
}: AddServiceDialogProps) {
  const [activeTab, setActiveTab] = useState("tour");
  const liquidationId = liquidation?.id ?? 0;

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Agregar Servicio</DialogTitle>
          <DialogDescription>
            Agregue un nuevo servicio a la liquidación #{liquidationId}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tour" className="gap-1">
                <MapPin className="size-4" />
                <span className="hidden sm:inline">Tour</span>
              </TabsTrigger>
              <TabsTrigger value="hotel" className="gap-1">
                <Hotel className="size-4" />
                <span className="hidden sm:inline">Hotel</span>
              </TabsTrigger>
              <TabsTrigger value="flight" className="gap-1">
                <Plane className="size-4" />
                <span className="hidden sm:inline">Vuelo</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="gap-1">
                <Package className="size-4" />
                <span className="hidden sm:inline">Adicional</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tour" className="mt-4">
            <TourServiceForm
              liquidationId={liquidationId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="hotel" className="mt-4">
            <HotelServiceForm
              liquidationId={liquidationId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="flight" className="mt-4">
            <FlightServiceForm
              liquidationId={liquidationId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="additional" className="mt-4">
            <AdditionalServiceForm
              liquidationId={liquidationId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
