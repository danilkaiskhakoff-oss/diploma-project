const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, convertMillimetersToTwip, PageBreak } = require('docx');
const fs = require('fs');

function T(text, opts = {}) {
  return new TextRun({ text, font: 'Times New Roman', size: opts.size || 28, bold: opts.bold || false, italics: opts.italics || false });
}

function P(text, opts = {}) {
  return new Paragraph({
    children: [T(text, opts)],
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { before: opts.before || 0, after: opts.after || 0, line: opts.line || 360 },
    indent: { firstLine: opts.fl !== undefined ? opts.fl : convertMillimetersToTwip(12.5), left: opts.l || convertMillimetersToTwip(5), right: opts.r || convertMillimetersToTwip(5) },
  });
}

function H(text, lvl = 1) {
  return new Paragraph({
    children: [T(text, { size: 28, bold: true })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: lvl === 1 ? 240 : 120, line: 360 },
    indent: { firstLine: convertMillimetersToTwip(12.5), left: convertMillimetersToTwip(5), right: convertMillimetersToTwip(5) },
    heading: lvl === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
  });
}

function TP(text, opts = {}) {
  return new Paragraph({ children: [T(text, { size: opts.size || 24 })], alignment: opts.align || AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 240 } });
}

function TC(text, opts = {}) {
  return new TableCell({
    children: [TP(text, opts)],
    width: opts.w ? { size: opts.w, type: WidthType.PERCENTAGE } : undefined,
    borders: { top: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, left: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, right: { style: BorderStyle.SINGLE, size: 1, color: '000000' } },
  });
}

function B(text) { return P('\u2013 ' + text, { fl: convertMillimetersToTwip(12.5), before: 0, after: 0 }); }
function N(text) { return P(text, { fl: convertMillimetersToTwip(12.5), before: 0, after: 0 }); }
function Empty() { return P('', { fl: 0 }); }
function Center(text, opts = {}) { return new Paragraph({ children: [T(text, opts)], alignment: AlignmentType.CENTER, spacing: { before: opts.before || 0, after: opts.after || 0, line: 360 }, indent: { left: opts.l || 0, right: opts.r || 0 } }); }

module.exports = { T, P, H, TP, TC, B, N, Empty, Center };
