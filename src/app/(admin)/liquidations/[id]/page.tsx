import { redirect } from "next/navigation";

interface LiquidationPageProps {
  params: Promise<{ id: string }>;
}

export default async function LiquidationPage({ params }: LiquidationPageProps) {
  const { id } = await params;
  redirect(`/liquidations/${id}/tours`);
}
