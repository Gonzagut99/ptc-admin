/**
 * This file re-exports types from the auto-generated api.ts file
 * to maintain a single source of truth for API types.
 * 
 * All types are imported from src/lib/api/api.ts which is generated
 * from the OpenAPI specification.
 */

import type { components } from './api-java';

// Re-export main entity types
export type DUser = components['schemas']['DUser'];
export type DStaff = components['schemas']['DStaff'];
export type DCustomer = components['schemas']['DCustomer'];
export type DLiquidation = components['schemas']['DLiquidation'];
export type LiquidationWithDetailsDto = components['schemas']['LiquidationWithDetailsDto'];

// Re-export service types
export type DPayment = components['schemas']['DPayment'];
export type DFlightService = components['schemas']['DFlightService'];
export type DHotelService = components['schemas']['DHotelService'];
export type DTourService = components['schemas']['DTourService'];
export type DAdditionalServices = components['schemas']['DAdditionalServices'];
export type DIncidency = components['schemas']['DIncidency'];

// Re-export paginated response types
export type PagedModelDUser = components['schemas']['PagedModelDUser'];
export type PagedModelDStaff = components['schemas']['PagedModelDStaff'];
export type PagedModelDCustomer = components['schemas']['PagedModelDCustomer'];
export type PagedModelLiquidationWithDetailsDto = components['schemas']['PagedModelLiquidationWithDetailsDto'];

// Re-export page metadata
export type PageMetadata = components['schemas']['PageMetadata'];

// Re-export error types
export type ErrorBody = components['schemas']['ErrorBody'];

// Generic paged response type alias for convenience
export type PagedResponse<T> = {
    content?: T[];
    page?: PageMetadata;
};
