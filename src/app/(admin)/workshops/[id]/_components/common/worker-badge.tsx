import { Badge } from "@/components/ui/badge";

interface WorkerBadgeProps {
  isActive: boolean;
}

export default function WorkerBadge({ isActive }: WorkerBadgeProps) {
  return isActive ? (
    <Badge variant="success">Activo</Badge>
  ) : (
    <Badge variant="destructive">Inactivo</Badge>
  );
}
