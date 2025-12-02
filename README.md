# PTC Agency Admin - Frontend

Panel de administración para **PTC (Peru Travel Company)** desarrollado con Next.js 15 y React 19.

## 📋 Descripción

Dashboard administrativo completo para la gestión de una agencia de viajes que incluye:

- **Dashboard interactivo** con métricas y gráficos en tiempo real
- **Gestión de Liquidaciones** (reservas de viaje completas)
- **Gestión de Clientes**
- **Gestión de Staff**
- **Gestión de Usuarios**
- **Sistema de Notificaciones** en tiempo real
- **Configuración de perfil y seguridad**

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js 15
│   ├── (admin)/                  # Grupo de rutas admin (con layout)
│   │   ├── _components/          # Componentes compartidos del admin
│   │   ├── _hooks/               # Hooks personalizados del admin
│   │   ├── customers/            # Módulo de clientes
│   │   ├── liquidations/         # Módulo de liquidaciones
│   │   ├── notifications/        # Módulo de notificaciones
│   │   ├── settings/             # Configuración de usuario
│   │   ├── staff/                # Módulo de staff
│   │   ├── users/                # Módulo de usuarios
│   │   ├── layout.tsx            # Layout del admin
│   │   └── page.tsx              # Dashboard principal
│   ├── auth/                     # Autenticación
│   │   └── log-in/              # Página de login
│   ├── globals.css               # Estilos globales
│   └── layout.tsx                # Layout raíz
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes UI base (shadcn/ui)
│   ├── layout/                   # Componentes de layout
│   ├── data-table/               # Tabla de datos genérica
│   ├── kbar/                     # Command palette
│   └── errors/                   # Componentes de error
├── contexts/                     # Contextos de React
│   ├── auth-provider.tsx         # Contexto de autenticación
│   ├── query-provider.tsx        # TanStack Query provider
│   └── theme-context.tsx         # Tema claro/oscuro
├── hooks/                        # Hooks globales
├── lib/                          # Utilidades y configuraciones
│   ├── api/                      # Cliente API generado (OpenAPI)
│   └── api-java/                 # Cliente API Java con auth
├── types/                        # Tipos TypeScript
└── utils/                        # Funciones utilitarias
```

### Estructura por Módulo (Feature-based)

Cada módulo sigue una estructura consistente:

```
liquidations/
├── _components/                  # Componentes del módulo
│   ├── table/                   # Componentes de tabla
│   │   ├── columns.tsx          # Definición de columnas
│   │   ├── liquidations-table.tsx
│   │   └── table-actions.tsx
│   ├── form/                    # Formularios
│   │   └── create-liquidation-form.tsx
│   └── detail/                  # Vista de detalle
│       └── liquidation-detail-dialog.tsx
├── _hooks/                       # Hooks del módulo
│   └── use-liquidations.ts      # Data fetching hooks
├── _schemas/                     # Schemas de validación (Zod)
│   └── liquidations-schemas.ts
├── _types/                       # Tipos del módulo
├── page.tsx                      # Página principal
└── layout.tsx                    # Layout del módulo (opcional)
```

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 15.x | Framework React con App Router |
| React | 19.x | Biblioteca UI |
| TypeScript | 5.x | Tipado estático |
| TanStack Query | 5.x | Data fetching y caching |
| openapi-fetch | - | Cliente API type-safe |
| openapi-react-query | - | Integración OpenAPI + TanStack Query |
| Zod | 3.x | Validación de schemas |
| React Hook Form | 7.x | Manejo de formularios |
| shadcn/ui | - | Componentes UI |
| Tailwind CSS | 4.x | Estilos utilitarios |
| Recharts | - | Gráficos y visualizaciones |
| date-fns | - | Manipulación de fechas |
| Lucide React | - | Iconos |
| Sonner | - | Notificaciones toast |
| nuqs | - | Estado en URL (query params) |

## 🔐 Autenticación

### Flujo de Autenticación

```
┌─────────┐    ┌─────────────┐    ┌─────────────┐
│  Login  │───▶│ Store Tokens│───▶│  Redirect   │
│  Form   │    │ (localStorage)   │  Dashboard  │
└─────────┘    └─────────────┘    └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │ Auth Context│
              │ (useAuth)   │
              └─────────────┘
```

### Token Management

- **Access Token**: Corta duración, usado en cada request
- **Refresh Token**: Larga duración, para renovar access token
- **Auto-refresh**: El cliente renueva tokens automáticamente cuando expiran

### Hooks de Auth

```typescript
// Obtener sesión actual
const { session, isLoading, isAuthenticated } = useAuth();

// Login
const { mutate: login } = useLogIn();

// Logout
const { mutate: logout } = useSignOut();

// Cambiar contraseña
const { mutate: changePassword } = useChangePassword();
```

## 📡 Data Fetching

### OpenAPI + TanStack Query

El proyecto usa tipos generados automáticamente desde el OpenAPI spec del backend:

```typescript
// Cliente API tipado
import { backendJava } from "@/lib/api-java/backend";

// Query con tipos automáticos
const { data, isLoading } = backendJava.useQuery(
  "get",
  "/liquidations/{id}",
  { params: { path: { id: liquidationId } } }
);

// Mutation con tipos automáticos
const mutation = backendJava.useMutation(
  "post",
  "/liquidations"
);
```

### Generación de Tipos

```bash
# Generar tipos desde OpenAPI spec
pnpm generate:api
```

Esto genera `src/lib/api/api.ts` con todos los tipos del backend.

## 🎨 Componentes UI

### shadcn/ui

Componentes base personalizables:

- `Button`, `Input`, `Select`, `Checkbox`
- `Dialog`, `Sheet`, `Dropdown`
- `Table`, `Card`, `Badge`
- `Form`, `Label`, `Textarea`
- `Tabs`, `Accordion`, `Collapsible`
- `Calendar`, `DatePicker`
- `Toast` (Sonner)

### Data Table

Tabla genérica con:

- Paginación server-side
- Ordenamiento
- Filtros
- Selección de filas
- Acciones por fila
- Columnas configurables

```typescript
<DataTable
  columns={columns}
  data={data}
  pagination={pagination}
  onPaginationChange={setPagination}
/>
```

## 📊 Dashboard

### Componentes del Dashboard

- **KPI Cards**: Métricas principales
- **Status Chart**: Gráfico de liquidaciones por estado
- **Monthly Revenue**: Ingresos mensuales
- **Payment Status**: Estado de pagos
- **Upcoming Deadlines**: Próximos vencimientos
- **Recent Activity**: Actividad reciente

### Hooks del Dashboard

```typescript
const { data: summary } = useDashboardSummary();
const { data: byStatus } = useLiquidationsByStatus();
const { data: byMonth } = useLiquidationsByMonth();
```

## 🔔 Notificaciones

### Sistema en Tiempo Real

- Conexión SSE (Server-Sent Events) al backend
- Notificaciones persistentes en base de datos
- Marcar como leídas
- Historial paginado

### Componentes

```typescript
// Tabla de notificaciones
<NotificationsTable userId={userId} />

// Badge con contador
<NotificationBadge count={unreadCount} />
```

## 🎯 Formularios

### React Hook Form + Zod

```typescript
// Schema de validación
const createCustomerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
});

// Formulario
const form = useForm<CreateCustomerInput>({
  resolver: zodResolver(createCustomerSchema),
  defaultValues: { name: "", email: "" },
});
```

## 🚀 Instalación y Ejecución

### Prerequisitos

- Node.js 20+
- pnpm 9+

### Desarrollo Local

1. **Instalar dependencias**
```bash
pnpm install
```

2. **Configurar variables de entorno**
```bash
cp env.example .env.local
```

```env
NEXT_PUBLIC_JAVA_API_URL=http://localhost:8090/ptc/api
```

3. **Generar tipos de API** (opcional, ya incluidos)
```bash
pnpm generate:api
```

4. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

5. **Abrir en navegador**
```
http://localhost:3000
```

### Scripts Disponibles

```bash
pnpm dev          # Desarrollo
pnpm build        # Build de producción
pnpm start        # Iniciar producción
pnpm lint         # Linting
pnpm generate:api # Generar tipos OpenAPI
```

## 📝 Buenas Prácticas Implementadas

### 1. Type Safety
- TypeScript estricto en todo el proyecto
- Tipos generados desde OpenAPI
- Zod para validación runtime

### 2. Server Components vs Client Components
- Server Components por defecto
- `"use client"` solo cuando es necesario
- Optimización de bundle size

### 3. Data Fetching
- TanStack Query para cache y estados
- Prefetching donde es útil
- Optimistic updates en mutations

### 4. State Management
- URL state con `nuqs` para filtros y paginación
- React Context para auth y tema
- Local state para UI ephemeral

### 5. Error Handling
- Error boundaries por módulo
- Toast notifications para feedback
- Páginas de error personalizadas

### 6. Performance
- Code splitting automático
- Lazy loading de componentes pesados
- Optimización de imágenes con `next/image`

### 7. Accesibilidad
- Componentes shadcn/ui accesibles
- Labels en formularios
- Focus management

### 8. Responsive Design
- Mobile-first con Tailwind
- Sidebar colapsable
- Tablas responsivas

### 9. UX/UI
- Loading states en todas las operaciones
- Skeleton loaders
- Confirmaciones para acciones destructivas
- Command palette (Cmd+K)

### 10. Code Organization
- Feature-based structure
- Colocation de código relacionado
- Barrel exports para imports limpios

## 🌐 Rutas de la Aplicación

```
/                           # Dashboard
/auth/log-in               # Login

/liquidations              # Lista de liquidaciones
/liquidations/new          # Nueva liquidación

/customers                 # Lista de clientes
/customers/new             # Nuevo cliente

/staff                     # Lista de staff
/users                     # Lista de usuarios

/notifications             # Centro de notificaciones

/settings/profile          # Perfil de usuario
/settings/security         # Seguridad (contraseña)
```

## 🎨 Temas

Soporte para tema claro y oscuro:

```typescript
const { theme, setTheme } = useTheme();

// Cambiar tema
setTheme("dark");
setTheme("light");
setTheme("system");
```

## 🤝 Contribución

1. Crear rama feature desde `develop`
2. Seguir la estructura de carpetas existente
3. Usar tipos TypeScript
4. Agregar validación Zod para formularios
5. Crear Pull Request

## 📄 Licencia

Proyecto privado - PTC Agency © 2025
