"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import LiquidationsTable from "@/app/(admin)/liquidations/_components/table/liquidations-table";
import { useGetCustomer } from "../../_hooks/customers-hooks";
import { Spinner } from "@/components/ui/spinner";

interface CustomerLiquidationsPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerLiquidationsPage({
  params,
}: CustomerLiquidationsPageProps) {
  const { id } = use(params);
  const customerId = Number(id);

  const { data: customer, isLoading: isLoadingCustomer } =
    useGetCustomer(customerId);

  if (isLoadingCustomer) {
    return (
      <PageContainer scrollable={false}>
        <div className="flex items-center justify-center h-64">
          <Spinner className="size-8" />
        </div>
      </PageContainer>
    );
  }

  const customerName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : `Cliente #${customerId}`;

  return (
    <PageContainer scrollable={false}>
      <Container
        title={`Liquidaciones de ${customerName}`}
        description={`Gestiona las liquidaciones del cliente ${customerName}.`}
        actions={
          <Button variant="outline" asChild>
            <Link href="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Clientes
            </Link>
          </Button>
        }
      >
        <LiquidationsTable customerId={customerId} />
      </Container>
    </PageContainer>
  );
}
