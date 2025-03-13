// lib/api/baybe-client.ts
import { ActionState } from "@/types";

// API Configuration
const API_BASE_URL = "http://localhost:8000"; // Update this if your Docker container uses a different port
const API_KEY = "123456789"; // This should match the API_KEY in your Docker container's environment

/**
 * Generic fetch function for API requests
 */
export async function fetchFromAPI(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY
  };

  const requestOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  console.log(`Fetching from API: ${method} ${url}`);
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Check the health status of the BayBE API
 */
export async function checkAPIHealthAction(): Promise<
  ActionState<{ status: string; using_gpu: boolean; gpu_info?: any }>
> {
  try {
    const data = await fetchFromAPI("/health");
    return {
      isSuccess: true,
      message: "API is healthy",
      data
    };
  } catch (error) {
    console.error("Health check failed:", error);
    return {
      isSuccess: false,
      message: `API health check failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Creates a new optimization with the given configuration
 */
export async function createOptimizationAction(
  optimizerId: string,
  config: any
): Promise<ActionState<{ status: string; message: string; constraint_count?: number }>> {
  try {
    const data = await fetchFromAPI(`/optimization/${optimizerId}`, "POST", config);
    return {
      isSuccess: true,
      message: "Optimization created successfully",
      data
    };
  } catch (error) {
    console.error("Error creating optimization:", error);
    return {
      isSuccess: false,
      message: `Failed to create optimization: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Gets the next suggestion for experimentation
 */
export async function getSuggestionAction(
  optimizerId: string,
  batchSize: number = 1
): Promise<ActionState<{ status: string; suggestions: any[] }>> {
  try {
    const data = await fetchFromAPI(`/optimization/${optimizerId}/suggest?batch_size=${batchSize}`);
    return {
      isSuccess: true,
      message: "Suggestions generated successfully",
      data
    };
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return {
      isSuccess: false,
      message: `Failed to get suggestions: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Adds a measurement to the optimization
 */
export async function addMeasurementAction(
  optimizerId: string,
  parameters: Record<string, any>,
  targetValue: number
): Promise<ActionState<{ status: string; message: string }>> {
  try {
    const data = await fetchFromAPI(
      `/optimization/${optimizerId}/measurement`,
      "POST",
      { parameters, target_value: targetValue }
    );
    return {
      isSuccess: true,
      message: "Measurement added successfully",
      data
    };
  } catch (error) {
    console.error("Error adding measurement:", error);
    return {
      isSuccess: false,
      message: `Failed to add measurement: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Adds multiple measurements to the optimization
 */
export async function addMultipleMeasurementsAction(
  optimizerId: string,
  measurements: { parameters: Record<string, any>; target_value: number }[]
): Promise<ActionState<{ status: string; message: string }>> {
  try {
    const data = await fetchFromAPI(
      `/optimization/${optimizerId}/measurements`,
      "POST",
      { measurements }
    );
    return {
      isSuccess: true,
      message: "Measurements added successfully",
      data
    };
  } catch (error) {
    console.error("Error adding multiple measurements:", error);
    return {
      isSuccess: false,
      message: `Failed to add measurements: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Gets the current best point for the optimization
 */
export async function getBestPointAction(
  optimizerId: string
): Promise<
  ActionState<{
    status: string;
    best_parameters?: Record<string, any>;
    best_value?: number;
    message?: string;
  }>
> {
  try {
    const data = await fetchFromAPI(`/optimization/${optimizerId}/best`);
    return {
      isSuccess: true,
      message: "Best point retrieved successfully",
      data
    };
  } catch (error) {
    console.error("Error getting best point:", error);
    return {
      isSuccess: false,
      message: `Failed to get best point: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Loads an existing optimization
 */
export async function loadOptimizationAction(
  optimizerId: string
): Promise<ActionState<{ status: string; message: string }>> {
  try {
    const data = await fetchFromAPI(`/optimization/${optimizerId}/load`);
    return {
      isSuccess: true,
      message: "Optimization loaded successfully",
      data
    };
  } catch (error) {
    console.error("Error loading optimization:", error);
    return {
      isSuccess: false,
      message: `Failed to load optimization: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}