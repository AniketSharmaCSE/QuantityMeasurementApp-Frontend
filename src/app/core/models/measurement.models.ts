// All unit types the app supports
export type MeasurementType = 'Length' | 'Weight' | 'Volume' | 'Temperature';
export type ActionType = 'compare' | 'convert' | 'arith';
export type ArithOperation = 'Add' | 'Subtract' | 'Divide';

// Maps each type to its available units — single source of truth
export const UNITS: Record<MeasurementType, string[]> = {
  Length:      ['Feet', 'Inches', 'Yards', 'Centimeters'],
  Weight:      ['Gram', 'Kilogram', 'Pound'],
  Volume:      ['Litre', 'Millilitre', 'Gallon'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
};

// ──────────────── Request shapes sent to the C# API ────────────────

export interface CompareRequest {
  category: MeasurementType;
  value1: number;
  unit1: string;
  value2: number;
  unit2: string;
}

export interface ConvertRequest {
  category: MeasurementType;
  value: number;
  fromUnit: string;
  toUnit: string;
}

export interface CalculateRequest {
  category: MeasurementType;
  value1: number;
  unit1: string;
  value2: number;
  unit2: string;
  operation: ArithOperation;
  targetUnit?: string;
}

// ──────────────── Response shapes returned by the C# API ────────────────

export interface Operand {
  value: number;
  unit: string;
  category?: string;
}

export interface QuantityResult {
  value: number;
  unit: string;
  category?: string;
}

export interface QuantityResponse {
  operation: string;
  success: boolean;
  // Compare
  boolResult?: boolean;
  // Convert / Arithmetic
  result?: QuantityResult;
  scalarResult?: number;
  // Operands (used for history display)
  operand1?: Operand;
  operand2?: Operand;
  // Error
  errorMessage?: string;
  // History timestamp
  timestamp?: string;
}
