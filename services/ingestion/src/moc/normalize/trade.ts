import type { MoCImportResponse, MoCImportItem } from "../types";

export interface NormalizedImportDeclaration {
  externalId: string | null;
  portExternalId: string;
  portName: string;
  commodityExternalId: string;
  commodityName: string;
  declarationDate: string;
  volume: number;
  unit: string;
  valueLocal: number | null;
  valueUsd: number | null;
  tariffCode: string | null;
  tariffAmount: number | null;
}

function parseDate(item: MoCImportItem): string {
  const raw = item.date ?? item.declarationDate ?? "";
  if (!raw) return new Date().toISOString().slice(0, 10);
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value.replace(/,/g, ""));
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

/** Normalize MoC import response into a list of declaration records. */
export function normalizeImportResponse(
  data: MoCImportResponse
): NormalizedImportDeclaration[] {
  const items: MoCImportItem[] =
    data.data ?? data.declarations ?? data.imports ?? [];
  const out: NormalizedImportDeclaration[] = [];

  for (const item of items) {
    const portCode = String(item.portCode ?? "").trim();
    const portName = String(item.portName ?? "Unknown Port").trim();
    const commodityCode = String(
      item.commodityCode ?? item.commodityId ?? ""
    ).trim();
    const commodityName = String(item.commodityName ?? "Unknown").trim();
    const externalId = item.id ?? item.declarationId ?? null;
    const declarationDate = parseDate(item);
    const volume = toNumber(item.volume);
    const unit = String(item.unit ?? "unit").trim();
    const valueLocal = item.valueLocal ?? item.valueLrd ?? null;
    const valueUsd = item.valueUsd ?? null;
    const tariffCode = item.tariffCode ? String(item.tariffCode).trim() : null;
    const tariffAmount =
      item.tariffAmount != null ? toNumber(item.tariffAmount) : null;

    const portExternalId =
      portCode || `port-${portName.replace(/\s+/g, "-")}`;
    const commodityExternalId =
      commodityCode || `name-${commodityName.replace(/\s+/g, "-")}`;

    if (volume <= 0) continue;

    out.push({
      externalId: externalId ? String(externalId) : null,
      portExternalId,
      portName,
      commodityExternalId,
      commodityName,
      declarationDate,
      volume,
      unit,
      valueLocal:
        valueLocal != null && !Number.isNaN(Number(valueLocal))
          ? Number(valueLocal)
          : null,
      valueUsd:
        valueUsd != null && !Number.isNaN(Number(valueUsd))
          ? Number(valueUsd)
          : null,
      tariffCode,
      tariffAmount,
    });
  }

  return out;
}
