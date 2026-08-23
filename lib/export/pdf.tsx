/**
 * PDF Export Module
 *
 * Generates PDF files using @react-pdf/renderer (pure JS, serverless-ready).
 * Replaces the previous Playwright/Chromium approach which fails on Vercel
 * Lambda because Chromium requires system libraries that are not present in
 * the Vercel serverless image.
 */

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { TableData, ColumnDef } from "./helpers";
import { STATUS_LABELS } from "./helpers";

interface PDFExportOptions {
  tables: TableData[];
  title?: string;
}

const BAB_COLORS: Record<
  number,
  { header: string; subHeader: string; accent: string }
> = {
  1: { header: "#2A78D6", subHeader: "#DBEAFE", accent: "#1C5CAB" },
  2: { header: "#1BAF7A", subHeader: "#D1FAE5", accent: "#199E70" },
  3: { header: "#EB6834", subHeader: "#FED7AA", accent: "#D95926" },
  4: { header: "#E34948", subHeader: "#FECACA", accent: "#D03B3B" },
  5: { header: "#4A3AA7", subHeader: "#DDD6FE", accent: "#9085E9" },
  6: { header: "#EDA100", subHeader: "#FEF3C7", accent: "#C98500" },
};

const FALLBACK_COLOR = {
  header: "#0F172A",
  subHeader: "#F1F5F9",
  accent: "#52514E",
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  titleBlock: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    padding: 20,
    marginBottom: 12,
    borderRadius: 4,
  },
  titleH1: { fontSize: 18, fontWeight: 700, letterSpacing: 1 },
  titleH2: {
    fontSize: 12,
    fontWeight: 600,
    marginTop: 3,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  infoBox: {
    border: "1pt solid #E1E0D9",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#F9F9F7",
  },
  infoRow: { flexDirection: "row", marginVertical: 2 },
  infoLabel: { fontWeight: 600, color: "#52514E", width: "30%" },
  infoValue: { width: "70%" },
  babHeader: {
    color: "#FFFFFF",
    padding: 8,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    marginVertical: 8,
    borderRadius: 3,
  },
  tableHeader: {
    padding: 6,
    marginTop: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
    backgroundColor: "#FFFFFF",
  },
  tableTitle: { fontSize: 10, fontWeight: 700, marginBottom: 3 },
  tableMeta: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    fontSize: 8,
    color: "#52514E",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    fontSize: 8,
    fontWeight: 600,
  },
  dataTable: { width: "100%", marginBottom: 10 },
  th: {
    color: "#FFFFFF",
    padding: 5,
    textAlign: "center",
    fontSize: 8,
    fontWeight: 700,
  },
  td: { padding: 4, fontSize: 8 },
  tdEmpty: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#898781",
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#E1E0D9",
  },
  footer: {
    textAlign: "center",
    fontSize: 7,
    color: "#898781",
    marginTop: 12,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: "#E1E0D9",
  },
});

interface InfoData {
  prodi: string;
  jenjang: string;
  tahun: string;
  semester: string;
}

function TitleBlock() {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.titleH1}>LAPORAN KINERJA PROGRAM STUDI</Text>
      <Text style={styles.titleH2}>(LKPS)</Text>
    </View>
  );
}

function InfoBox({ prodi, jenjang, tahun, semester }: InfoData) {
  return (
    <View style={styles.infoBox}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Perguruan Tinggi</Text>
        <Text style={styles.infoValue}>Universitas Bina Bangsa Getsempena</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Program Studi</Text>
        <Text style={styles.infoValue}>
          {prodi} ({jenjang})
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Tahun Akademik</Text>
        <Text style={styles.infoValue}>
          {tahun} {semester}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Tanggal Cetak</Text>
        <Text style={styles.infoValue}>
          {new Date().toLocaleString("id-ID")}
        </Text>
      </View>
    </View>
  );
}

interface TableSectionProps {
  table: TableData;
  colors: { header: string; subHeader: string; accent: string };
}

function TableSection({ table, colors }: TableSectionProps) {
  const { definition, lkps } = table;
  const dataColumns: ColumnDef[] = (definition.kolomDefinitions || []).filter(
    (c) => c.type !== "header"
  );
  const status = lkps ? STATUS_LABELS[lkps.status] : "Belum Diisi";
  const rowCount = lkps?.rows.length || 0;
  const rows = lkps?.rows || [];

  return (
    <View wrap={false}>
      <View
        style={[styles.tableHeader, { borderLeftColor: colors.header }]}
      >
        <Text style={[styles.tableTitle, { color: colors.accent }]}>
          {definition.kode} — {definition.nama}
        </Text>
        <View style={styles.tableMeta}>
          <Text
            style={[
              styles.badge,
              { backgroundColor: colors.subHeader, color: colors.accent },
            ]}
          >
            {rowCount} data
          </Text>
          {lkps && (
            <Text style={{ fontSize: 8, color: "#52514E" }}>
              Status:{" "}
              <Text style={{ fontWeight: 700, color: colors.accent }}>
                {status}
              </Text>
            </Text>
          )}
        </View>
      </View>
      <DataTable dataColumns={dataColumns} rows={rows} colors={colors} />
    </View>
  );
}

interface DataTableProps {
  dataColumns: ColumnDef[];
  rows: { rowData: Record<string, unknown> }[];
  colors: { header: string; subHeader: string; accent: string };
}

function DataTable({ dataColumns, rows, colors }: DataTableProps) {
  const colCount = Math.max(dataColumns.length, 1);
  const colWidth = `${100 / colCount}%` as `${number}%`;

  return (
    <View style={styles.dataTable}>
      <View style={{ flexDirection: "row", backgroundColor: colors.header }}>
        {dataColumns.length === 0 ? (
          <View style={{ width: "100%", padding: 4 }}>
            <Text style={styles.th}>—</Text>
          </View>
        ) : (
          dataColumns.map((col, i) => (
            <View key={`th-${i}`} style={{ width: colWidth, padding: 4 }}>
              <Text style={styles.th}>{col.label}</Text>
            </View>
          ))
        )}
      </View>
      {rows.length === 0 ? (
        <Text style={styles.tdEmpty}>Belum ada data</Text>
      ) : (
        rows.map((row, ri) => {
          const bg = ri % 2 === 0 ? colors.subHeader : "#FFFFFF";
          return (
            <View
              key={`row-${ri}`}
              style={{ flexDirection: "row", backgroundColor: bg }}
            >
              {dataColumns.length === 0 ? (
                <View
                  style={{
                    width: "100%",
                    padding: 4,
                    borderWidth: 0.5,
                    borderColor: "#E1E0D9",
                  }}
                >
                  <Text style={styles.td}>—</Text>
                </View>
              ) : (
                dataColumns.map((col, ci) => {
                  let value: unknown = row.rowData[col.key];
                  if (value === null || value === undefined) value = "";
                  if (Array.isArray(value)) value = value.join(", ");
                  if (typeof value === "object" && value !== null)
                    value = JSON.stringify(value);
                  const align = col.type === "number" ? "right" : "left";
                  return (
                    <View
                      key={`cell-${ri}-${ci}`}
                      style={{
                        width: colWidth,
                        borderLeftWidth: 0,
                        borderRightWidth: 0.5,
                        borderTopWidth: 0.5,
                        borderBottomWidth: 0.5,
                        borderColor: "#E1E0D9",
                        padding: 4,
                      }}
                    >
                      <Text style={{ fontSize: 8, textAlign: align }}>
                        {String(value)}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          );
        })
      )}
    </View>
  );
}

interface BABSectionProps {
  bab: number;
  tables: TableData[];
}

function BABSection({ bab, tables }: BABSectionProps) {
  const colors = BAB_COLORS[bab] || FALLBACK_COLOR;
  return (
    <>
      <View style={[styles.babHeader, { backgroundColor: colors.header }]}>
        <Text>BAB {bab}</Text>
      </View>
      {tables.map((table, idx) => (
        <TableSection key={`bab-${bab}-tbl-${idx}`} table={table} colors={colors} />
      ))}
    </>
  );
}

function Footer() {
  return (
    <Text style={styles.footer} fixed>
      Generated: {new Date().toLocaleString("id-ID")} | SIM-LKPS v0.1.0
    </Text>
  );
}

interface LKPSDocumentProps {
  tables: TableData[];
}

function LKPSDocument({ tables }: LKPSDocumentProps) {
  const tablesByBab = new Map<number, TableData[]>();
  for (const table of tables) {
    const bab = table.definition.bab;
    if (!tablesByBab.has(bab)) tablesByBab.set(bab, []);
    tablesByBab.get(bab)!.push(table);
  }
  const sortedBabs = Array.from(tablesByBab.keys()).sort((a, b) => a - b);
  const firstTa = tables[0]?.lkps?.tahunAkademik;

  const info: InfoData = {
    prodi: firstTa?.prodi.nama || "-",
    jenjang: firstTa?.prodi.jenjang || "-",
    tahun: firstTa?.tahun || "-",
    semester: firstTa?.semester || "",
  };

  return (
    <Document
      title="Laporan Kinerja Program Studi (LKPS)"
      author="SIM-LKPS UBBG"
      creator="SIM-LKPS"
      producer="SIM-LKPS"
    >
      <Page size="A4" style={styles.page}>
        <TitleBlock />
        <InfoBox {...info} />
        <Footer />
      </Page>
      {sortedBabs.map((bab) => {
        const babTables = tablesByBab.get(bab) || [];
        return (
          <Page
            key={`page-bab-${bab}`}
            size="A4"
            style={styles.page}
            wrap
          >
            <BABSection bab={bab} tables={babTables} />
            <Footer />
          </Page>
        );
      })}
    </Document>
  );
}

export async function generatePDFDocument(
  options: PDFExportOptions
): Promise<Buffer> {
  const buffer = await renderToBuffer(<LKPSDocument tables={options.tables} />);
  return buffer;
}

export async function generateSingleTablePDF(
  table: TableData
): Promise<Buffer> {
  return generatePDFDocument({ tables: [table] });
}
