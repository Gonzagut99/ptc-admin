import { backend } from "@/lib/api/types/backend";

export const useGetPermissions = () => {
  return backend.useQuery("get", "/api/admin/roles/permissions");
};
