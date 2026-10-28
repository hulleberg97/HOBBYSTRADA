import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { COMPANY } from "./company";

export type PdfBlock = { heading?: string; text?: string; items?: string[] };

/** Tegn Helvetica ikke har i WinAnsi, byttes ut så PDF-en ikke feiler. */
const safe = (s: string) => s.replace(/[–—]/g, "-").replace(/…/g, "...").replace(/[^\x20-\x7E\xA0-\xFF€]/g, "?");

/** En enkel A4-PDF med overskrift, avsnitt og punktlister. Brukes til vedleggene i kvitteringen. */
export async function textPdf(title: string, subtitle: string, blocks: PdfBlock[]) {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setAuthor(COMPANY.name);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595.28, H = 841.89, M = 56, LINE = 14, SIZE = 10.5;
  let page = doc.addPage([W, H]);
  let y = H - M;

  const wrap = (text: string, f: typeof font, size: number, width: number) => {
    const lines: string[] = [];
    for (const para of safe(text).split("\n")) {
      let line = "";
      for (const word of para.split(" ")) {
        const test = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(test, size) > width && line) {
          lines.push(line);
          line = word;
        } else line = test;
      }
      lines.push(line);
    }
    return lines;
  };
  const ensure = (needed: number) => {
    if (y - needed < M) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };
  const write = (text: string, f: typeof font, size: number, indent = 0, gap = LINE) => {
    for (const line of wrap(text, f, size, W - 2 * M - indent)) {
      ensure(gap);
      page.drawText(line, { x: M + indent, y: y - size, size, font: f, color: rgb(0.06, 0.1, 0.17) });
      y -= gap;
    }
  };

  write(title, bold, 18, 0, 24);
  write(subtitle, font, 9.5, 0, 14);
  y -= 10;
  for (const b of blocks) {
    if (b.heading) {
      y -= 6;
      write(b.heading, bold, 12.5, 0, 18);
    }
    if (b.text) {
      write(b.text, font, SIZE);
      y -= 6;
    }
    if (b.items) {
      for (const item of b.items) {
        ensure(LINE);
        page.drawText("•", { x: M + 4, y: y - SIZE, size: SIZE, font });
        write(item, font, SIZE, 16);
      }
      y -= 6;
    }
  }
  return Buffer.from(await doc.save());
}
