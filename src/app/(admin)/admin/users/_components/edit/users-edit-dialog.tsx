"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollArea,
  DialogTitle,
} from "@/components/ui/dialog-responsive";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { PhoneInput } from "@/components/ui/phone-input";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BaseErrorResponse } from "@/lib/api/types/common";
import { PasswordField } from "../../../_shared/_components/common/password-field";
import { useGetUser, useUpdateUser } from "../../_hooks/users-hooks";
import { FormUsersSchema, usersSchema } from "../../_schemas/users.schema";
import { RolePermissionsCollapsible } from "../common/role-permissions-collapsible";
import RoleSearchField from "../search/role-search-field";

interface UsersEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function UsersEditDialog({
  open,
  onOpenChange,
  userId,
}: UsersEditDialogProps) {
  const { mutate: updateUser, isPending } = useUpdateUser();
  const {
    data: userData,
    isLoading: isLoadingUser,
    error,
  } = useGetUser(userId);

  const form = useForm<FormUsersSchema>({
    resolver: zodResolver(usersSchema),
    defaultValues: {
      idNumber: "",
      name: "",
      lastName: "",
      post: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      roleIds: [],
      isActive: true,
    },
  });

  // Cargar datos del usuario cuando se abra el diálogo
  useEffect(() => {
    if (userData && open) {
      form.reset({
        idNumber: userData.idNumber || "",
        name: userData.name || "",
        lastName: userData.lastName || "",
        post: userData.post || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        password: "", // No cargar la contraseña por seguridad
        roleIds: userData.roles?.map((role) => role.id) || [],
        isActive: userData.isActive ?? true,
      });
    }
  }, [userData, open, form]);

  const onSubmit = (values: FormUsersSchema) => {
    let password: string | undefined;
    if (values.password && values.password.trim() !== "") {
      password = values.password;
    }

    updateUser(
      {
        params: { path: { id: userId } },
        body: {
          idNumber: values.idNumber,
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          ...(password && { password }),
          roleIds: values.roleIds,
          post: values.post,
          isActive: values.isActive,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      },
    );
  };

  const handlerGeneratePassword = useCallback(
    (password: string) => {
      form.setValue("password", password);
    },
    [form],
  );

  if (isLoadingUser) {
    <DialogUserLoading open={open} onOpenChange={onOpenChange} />;
  }
  if (error)
    return (
      <DialogUserError open={open} onOpenChange={onOpenChange} error={error} />
    );

  return (
    <DialogContentComponent open={open} onOpenChange={onOpenChange}>
      <DialogScrollArea>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-6"
            id="users-edit-form"
          >
            <FormSection title="Información de Identificación" icon={IdCard}>
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>DNI</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type="number"
                          placeholder="Ingrese el DNI del usuario"
                          disabled={isPending}
                          {...field}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Ingrese el nombre del usuario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Apellido</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Ingrese el apellido del usuario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="post"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Cargo</span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Ingrese el cargo del usuario"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Información de Contacto" icon={Phone}>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Teléfono</FormLabel>
                      <FormControl>
                        <PhoneInput
                          disabled={isPending}
                          defaultCountry="PE"
                          placeholder="Ingrese el teléfono del usuario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Correo electrónico</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Ingrese el correo electrónico del usuario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Dirección</span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Ingrese la dirección del usuario"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection title="Credenciales de Acceso" icon={Lock}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <PasswordField
                    field={field}
                    isPending={isPending}
                    onGeneratePassword={handlerGeneratePassword}
                    placeholder="Ingrese la nueva contraseña del usuario"
                  />
                )}
              />
            </FormSection>

            <FormSection title="Perfil y Permisos" icon={Shield}>
              <FormField
                control={form.control}
                name="roleIds"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-3">
                        <RoleSearchField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Buscar roles..."
                          searchPlaceholder="Escribir nombre del rol..."
                          disabled={isPending}
                        />
                        <RolePermissionsCollapsible
                          selectedRoleIds={field.value || []}
                          isLoading={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Estado del usuario</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <ToggleGroup
                          type="single"
                          variant="outline"
                          value={field.value ? "true" : "false"}
                          onValueChange={(value) => {
                            field.onChange(value === "true");
                          }}
                          className="grid grid-cols-2"
                        >
                          <ToggleGroupItem
                            value="true"
                            className="flex flex-col items-center py-1 h-auto text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-700"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <span className="font-medium">Activo</span>
                            </div>
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="false"
                            className="flex flex-col items-center py-1 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 data-[state=on]:bg-red-100 data-[state=on]:text-red-700"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="font-medium">Inactivo</span>
                            </div>
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {field.value
                        ? "El usuario podrá iniciar sesión, acceder al sistema y realizar todas las operaciones según sus permisos asignados."
                        : "El usuario no podrá iniciar sesión ni acceder al sistema. Sus datos se mantienen pero sin acceso."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
          </form>
        </Form>
      </DialogScrollArea>
      <DialogFooter className="flex gap-2 sm:flex-row-reverse w-full sm:justify-start">
        <Button type="submit" form="users-edit-form" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4" />}
          <Save className="h-4 w-4 shrink-0" />
          Guardar cambios
        </Button>
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending}>
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContentComponent>
  );
}

export const DialogContentComponent = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Aquí puedes editar la información del usuario.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

function DialogUserLoading({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogContentComponent open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center justify-center py-8">
        <Spinner />
        <span className="ml-2">Cargando detalles del usuario...</span>
      </div>
    </DialogContentComponent>
  );
}

function DialogUserError({
  open,
  onOpenChange,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: BaseErrorResponse;
}) {
  return (
    <DialogContentComponent open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Error: {error?.error?.message}</p>
      </div>
    </DialogContentComponent>
  );
}
