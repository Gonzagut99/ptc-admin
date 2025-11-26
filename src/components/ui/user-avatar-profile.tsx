import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    imageUrl?: string;
    name?: string | null;
    email: string;
  } | null;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage src={user?.imageUrl || ""} alt={user?.name || ""} />
        <AvatarFallback className="rounded-lg">
          {user?.name?.slice(0, 2)?.toUpperCase() || (
            <User className="size-4 shrink-0" />
          )}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user?.name || ""}</span>
          <span className="truncate text-xs">{user?.email || ""}</span>
        </div>
      )}
    </div>
  );
}
