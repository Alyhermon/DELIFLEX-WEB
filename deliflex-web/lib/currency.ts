// Mismo formato que usa la app movil (core/utils/currency.ts): pesos
// dominicanos con separador de miles, ej. 1550 -> "RD$1,550.00".
export function formatMoney(amount: number | string | null | undefined): string {
  const value = Number(amount);
  const safeValue = Number.isFinite(value) ? value : 0;
  const isNegative = safeValue < 0;
  const [intPart, decPart] = Math.abs(safeValue).toFixed(2).split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${isNegative ? "-" : ""}RD$${withThousands}.${decPart}`;
}
