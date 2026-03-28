import type { VitalType } from "@/features/vitals/types/vitals.types";

export type CsvParseResult = {
  rows: Array<{ recordedAt: string; value1: number; value2?: number }>;
  invalidRows: number;
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replaceAll("_", "");
}

function splitCsvLine(line: string) {
  return line.split(",").map((part) => part.trim());
}

export function parseVitalsCsv(input: { csv: string; type: VitalType }): CsvParseResult {
  const lines = input.csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  if (lines.length < 2) {
    return { rows: [], invalidRows: 0 };
  }

  const headers = splitCsvLine(lines[0]).map(normalizeHeader);
  const dateIndex = headers.findIndex((header) => ["date", "datetime", "timestamp", "recordedat"].includes(header));
  const valueIndex = headers.findIndex((header) => ["value", "value1", "heartrate", "steps"].includes(header));
  const systolicIndex = headers.findIndex((header) => ["systolic", "sys"].includes(header));
  const diastolicIndex = headers.findIndex((header) => ["diastolic", "dia"].includes(header));

  const rows: CsvParseResult["rows"] = [];
  let invalidRows = 0;

  for (const line of lines.slice(1)) {
    const cols = splitCsvLine(line);
    const dateValue = dateIndex >= 0 ? cols[dateIndex] : cols[0];

    if (!dateValue) {
      invalidRows += 1;
      continue;
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      invalidRows += 1;
      continue;
    }

    if (input.type === "BP") {
      const sys = Number(cols[systolicIndex >= 0 ? systolicIndex : 1]);
      const dia = Number(cols[diastolicIndex >= 0 ? diastolicIndex : 2]);
      if (Number.isNaN(sys) || Number.isNaN(dia)) {
        invalidRows += 1;
        continue;
      }

      rows.push({ recordedAt: parsedDate.toISOString(), value1: sys, value2: dia });
      continue;
    }

    const rawValue = cols[valueIndex >= 0 ? valueIndex : 1];
    const value1 = Number(rawValue);

    if (Number.isNaN(value1)) {
      invalidRows += 1;
      continue;
    }

    rows.push({ recordedAt: parsedDate.toISOString(), value1 });
  }

  return { rows, invalidRows };
}
