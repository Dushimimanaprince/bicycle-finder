const fs = require('fs');
const path = require('path');

// =========================================================================
// ADVANCED STANDARDS-COMPLIANT PDF ENGINE (WinAnsi / A4 Flow Layout)
// =========================================================================

class FlowPDF {
  constructor(pageWidth = 595.28, pageHeight = 841.89) {
    this.width = pageWidth;
    this.height = pageHeight;
    this.pages = [];
    this.currentPage = null;
    this.pageNumber = 0;

    // Layout boundaries
    this.leftM = 42;
    this.rightM = 553;
    this.contentW = this.rightM - this.leftM; // 511 pt
    this.topM = 52;
    this.bottomM = 795;
    this.curY = this.topM;
  }

  addPage(isCover = false) {
    this.pageNumber++;
    const page = {
      number: this.pageNumber,
      isCover: isCover,
      stream: []
    };
    this.pages.push(page);
    this.currentPage = page;
    this.curY = isCover ? 0 : this.topM;
    return page;
  }

  checkSpace(heightNeeded) {
    if (this.curY + heightNeeded > this.bottomM) {
      this.addPage(false);
      return true;
    }
    return false;
  }

  toPdfY(y) {
    return this.height - y;
  }

  sanitize(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/[\u2014\u2013]/g, '-')     // em/en dashes
      .replace(/[\u2018\u2019]/g, "'")     // smart single quotes
      .replace(/[\u201C\u201D]/g, '"')     // smart double quotes
      .replace(/[\u2022\u2023]/g, '*')     // bullets
      .replace(/[\u2192]/g, '->')          // arrow
      .replace(/[^\x00-\x7F]/g, ' ');      // replace any non-ascii with space
  }

  escapePdfText(str) {
    const clean = this.sanitize(str);
    return clean
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  raw(cmd) {
    this.currentPage.stream.push(cmd);
  }

  save() { this.raw('q'); }
  restore() { this.raw('Q'); }

  setFillColor(c) {
    this.raw(`${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(3)} rg`);
  }

  setStrokeColor(c) {
    this.raw(`${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(3)} RG`);
  }

  setLineWidth(w) {
    this.raw(`${w.toFixed(2)} w`);
  }

  drawRect(x, y, w, h, fill = null, stroke = null, lineWidth = 1) {
    this.save();
    if (fill) this.setFillColor(fill);
    if (stroke) {
      this.setStrokeColor(stroke);
      this.setLineWidth(lineWidth);
    }
    const pdfY = this.toPdfY(y + h);
    this.raw(`${x.toFixed(2)} ${pdfY.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`);
    if (fill && stroke) this.raw('B');
    else if (fill) this.raw('f');
    else if (stroke) this.raw('S');
    this.restore();
  }

  drawLine(x1, y1, x2, y2, color = [0.7, 0.7, 0.7], lineWidth = 1) {
    this.save();
    this.setStrokeColor(color);
    this.setLineWidth(lineWidth);
    const py1 = this.toPdfY(y1);
    const py2 = this.toPdfY(y2);
    this.raw(`${x1.toFixed(2)} ${py1.toFixed(2)} m ${x2.toFixed(2)} ${py2.toFixed(2)} l S`);
    this.restore();
  }

  measureText(text, size, isBold = false) {
    const str = this.sanitize(text);
    if (!str) return 0;
    const charWidths = {
      default: 0.54,
      ' ': 0.28, '.': 0.28, ',': 0.28, ':': 0.28, ';': 0.28, '!': 0.28, 'i': 0.23, 'l': 0.23,
      'I': 0.28, 't': 0.28, 'f': 0.28, 'j': 0.23, 'r': 0.33, 'm': 0.83, 'w': 0.72, 'W': 0.89,
      'M': 0.83, 'A': 0.67, 'B': 0.67, 'C': 0.72, 'D': 0.72, 'E': 0.67, 'F': 0.61, 'G': 0.78,
      'H': 0.72, 'J': 0.50, 'K': 0.67, 'L': 0.56, 'N': 0.72, 'O': 0.78, 'P': 0.67, 'Q': 0.78,
      'R': 0.72, 'S': 0.67, 'T': 0.61, 'U': 0.72, 'V': 0.67, 'X': 0.67, 'Y': 0.67, 'Z': 0.61,
      '1': 0.50, '0': 0.55, '2': 0.55, '3': 0.55, '4': 0.55, '5': 0.55, '6': 0.55, '7': 0.55,
      '8': 0.55, '9': 0.55, '(': 0.33, ')': 0.33, '[': 0.33, ']': 0.33, '-': 0.33, '/': 0.28,
      '>': 0.55, '<': 0.55, '=': 0.55, '+': 0.55, '%': 0.85
    };
    let width = 0;
    for (const char of str) {
      const factor = (charWidths[char] || 0.54) * (isBold ? 1.05 : 1.0);
      width += factor * size;
    }
    return width;
  }

  wrapText(text, maxWidth, size, isBold = false) {
    const str = this.sanitize(text);
    if (!str) return [];
    const words = str.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word === '\n') {
        if (currentLine) lines.push(currentLine);
        lines.push('');
        currentLine = '';
        continue;
      }
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = this.measureText(testLine, size, isBold);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  drawText(text, x, y, options = {}) {
    if (!text && text !== 0) return;
    const str = this.sanitize(text);
    const font = options.font || 'F1'; // F1 = Regular, F2 = Bold, F3 = Oblique
    const size = options.size || 9.5;
    const color = options.color || [0.1, 0.1, 0.1];
    const align = options.align || 'left';

    let drawX = x;
    if (align === 'center' || align === 'right') {
      const isBold = font === 'F2';
      const textWidth = this.measureText(str, size, isBold);
      if (align === 'center') drawX = x - textWidth / 2;
      else if (align === 'right') drawX = x - textWidth;
    }

    this.save();
    this.setFillColor(color);
    const pdfY = this.toPdfY(y);
    this.raw(`BT /${font} ${size.toFixed(1)} Tf ${drawX.toFixed(2)} ${pdfY.toFixed(2)} Td (${this.escapePdfText(str)}) Tj ET`);
    this.restore();
  }

  drawParagraph(text, x, y, maxWidth, options = {}) {
    const font = options.font || 'F1';
    const size = options.size || 8.5;
    const lineHeight = options.lineHeight || (size * 1.32);
    const color = options.color || [0.18, 0.22, 0.28];
    const isBold = font === 'F2';

    const rawLines = String(text).split('\n');
    let curY = y;
    for (const rawLine of rawLines) {
      const wrapped = this.wrapText(rawLine, maxWidth, size, isBold);
      for (const line of wrapped) {
        this.drawText(line, x, curY, { font, size, color });
        curY += lineHeight;
      }
      if (rawLines.length > 1) curY += 2; // small break between manual paragraphs
    }
    return curY;
  }

  drawBadge(text, x, y, bg = [0.12, 0.23, 0.37], fg = [1, 1, 1], fontSize = 7.5) {
    const textWidth = this.measureText(text, fontSize, true);
    const padX = 5;
    const h = fontSize + 6;
    const w = textWidth + padX * 2;
    this.drawRect(x, y - fontSize + 1, w, h, bg, null);
    this.drawText(text, x + padX, y + 2, { font: 'F2', size: fontSize, color: fg });
    return w;
  }

  // Multi-line robust table
  drawTable(headers, colWidths, rows) {
    const headerH = 18;
    this.checkSpace(headerH + 30);

    let y = this.curY;
    // Draw Header
    this.drawRect(this.leftM, y, this.contentW, headerH, COLORS.navy, null);
    let curX = this.leftM;
    for (let c = 0; c < headers.length; c++) {
      this.drawText(headers[c], curX + 6, y + 12.5, { font: 'F2', size: 8, color: COLORS.white });
      curX += colWidths[c];
    }
    y += headerH;

    // Draw Rows
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      // Pre-calculate wrapped lines for every cell to determine row height
      const cellLines = [];
      let maxLines = 1;

      for (let c = 0; c < row.length; c++) {
        const text = String(row[c]);
        const pad = 12;
        const maxCellW = colWidths[c] - pad;
        const isBold = c === 0;
        const lines = this.wrapText(text, maxCellW, 7.5, isBold);
        cellLines.push(lines);
        if (lines.length > maxLines) maxLines = lines.length;
      }

      const rowH = Math.max(16, maxLines * 10 + 6);

      // Check space for row
      if (y + rowH > this.bottomM) {
        this.curY = y;
        this.addPage(false);
        y = this.curY;
        // Redraw table header on new page
        this.drawRect(this.leftM, y, this.contentW, headerH, COLORS.navy, null);
        curX = this.leftM;
        for (let c = 0; c < headers.length; c++) {
          this.drawText(headers[c], curX + 6, y + 12.5, { font: 'F2', size: 8, color: COLORS.white });
          curX += colWidths[c];
        }
        y += headerH;
      }

      const bg = (r % 2 === 0) ? COLORS.white : COLORS.bgLight;
      this.drawRect(this.leftM, y, this.contentW, rowH, bg, COLORS.borderLight, 0.5);

      curX = this.leftM;
      for (let c = 0; c < row.length; c++) {
        const lines = cellLines[c];
        const isBold = (c === 0 && row.length > 2);
        let textY = y + 10;
        for (const line of lines) {
          this.drawText(line, curX + 6, textY, {
            font: isBold ? 'F2' : 'F1',
            size: 7.5,
            color: COLORS.darkText
          });
          textY += 10;
        }
        curX += colWidths[c];
      }
      y += rowH;
    }

    this.drawLine(this.leftM, y, this.rightM, y, COLORS.border, 1);
    this.curY = y + 12;
  }

  // Requirement Card Box with dynamic auto-flow
  drawReqCard(id, title, priority, desc, inputs, processing, outputs, acceptance) {
    // Estimate height
    const labelW = 82;
    const bodyW = this.contentW - labelW - 14;

    const descLines = this.wrapText(desc, bodyW, 7.8, false).length;
    const inputLines = this.wrapText(inputs, bodyW, 7.8, false).length;
    const procLines = this.wrapText(processing, bodyW, 7.8, false).length;
    const outLines = this.wrapText(outputs, bodyW, 7.8, false).length;
    const accLines = this.wrapText(acceptance, bodyW, 7.8, false).length;

    const totalTextH = (descLines + inputLines + procLines + outLines + accLines) * 10.5 + 40;
    const cardH = Math.max(105, totalTextH);

    this.checkSpace(cardH + 10);

    const cardY = this.curY;
    const boxW = this.contentW;

    // Header strip
    this.drawRect(this.leftM, cardY, boxW, 18, COLORS.navyLight, COLORS.border, 0.8);
    this.drawRect(this.leftM, cardY, 4, 18, COLORS.teal, null);

    this.drawText(id, this.leftM + 10, cardY + 12.5, { font: 'F2', size: 8.5, color: COLORS.navy });
    this.drawText(title, this.leftM + 90, cardY + 12.5, { font: 'F2', size: 8.5, color: COLORS.darkText });

    let pBg = COLORS.greenLight;
    let pFg = COLORS.green;
    if (priority === 'HIGH' || priority === 'CRITICAL') { pBg = COLORS.goldLight; pFg = COLORS.gold; }
    this.drawBadge(priority, this.rightM - 52, cardY + 12.5, pBg, pFg, 7);

    let curY = cardY + 24;

    const fields = [
      ['Description:', desc, 'F1', COLORS.bodyText],
      ['Inputs / Triggers:', inputs, 'F1', COLORS.bodyText],
      ['Processing Logic:', processing, 'F1', COLORS.bodyText],
      ['Outputs / State:', outputs, 'F1', COLORS.bodyText],
      ['Acceptance Rule:', acceptance, 'F3', COLORS.darkText]
    ];

    for (const [lbl, val, font, color] of fields) {
      this.drawText(lbl, this.leftM + 10, curY + 7.5, { font: 'F2', size: 7.8, color: lbl === 'Acceptance Rule:' ? COLORS.teal : COLORS.navyDark });
      curY = this.drawParagraph(val, this.leftM + labelW, curY + 7.5, bodyW, {
        font: font, size: 7.8, lineHeight: 10.5, color: color
      });
      curY += 2;
    }

    const actualCardH = curY - cardY + 4;
    this.drawRect(this.leftM, cardY, boxW, actualCardH, null, COLORS.border, 0.8);

    this.curY = curY + 12;
  }

  // Section title banner
  drawSectionHeader(title, sectionNum) {
    this.checkSpace(40);
    const y = this.curY;
    this.drawRect(this.leftM, y, this.contentW, 21, COLORS.navy, null);
    this.drawRect(this.leftM, y, 4, 21, COLORS.gold, null);
    this.drawText(`SECTION ${sectionNum}: ${title.toUpperCase()}`, this.leftM + 12, y + 14.5, {
      font: 'F2', size: 9.5, color: COLORS.white
    });
    this.curY = y + 29;
  }

  // Subsection title
  drawSubHeader(title) {
    this.checkSpace(28);
    const y = this.curY;
    this.drawText(title, this.leftM, y + 10, { font: 'F2', size: 9.5, color: COLORS.navyDark });
    this.drawLine(this.leftM, y + 13, this.leftM + 180, y + 13, COLORS.teal, 1.2);
    this.curY = y + 21;
  }

  build() {
    const totalPages = this.pages.length;
    let out = '%PDF-1.4\n';
    const allObjs = [];

    // Catalog & Pages root
    allObjs.push('<< /Type /Catalog /Pages 2 0 R >>'); // 1: Catalog
    allObjs.push(''); // 2: Pages
    allObjs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'); // 3: F1 Regular
    allObjs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'); // 4: F2 Bold
    allObjs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>'); // 5: F3 Oblique

    const pageObjIndices = [];
    let nextObjNum = 6;

    for (let p = 0; p < totalPages; p++) {
      const page = this.pages[p];
      const streamContent = page.stream.join('\n');
      const streamLen = Buffer.byteLength(streamContent, 'utf8');

      const streamObjIndex = nextObjNum++;
      const pageObjIndex = nextObjNum++;

      pageObjIndices.push(pageObjIndex);

      allObjs.push(`<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`);
      allObjs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.width.toFixed(2)} ${this.height.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${streamObjIndex} 0 R >>`);
    }

    allObjs[1] = `<< /Type /Pages /Kids [${pageObjIndices.map(idx => `${idx} 0 R`).join(' ')}] /Count ${totalPages} >>`;

    const offsets = [];
    let pos = Buffer.byteLength(out, 'utf8');

    for (let i = 0; i < allObjs.length; i++) {
      offsets.push(pos);
      const objStr = `${i + 1} 0 obj\n${allObjs[i]}\nendobj\n`;
      out += objStr;
      pos += Buffer.byteLength(objStr, 'utf8');
    }

    const xrefOffset = pos;
    out += `xref\n0 ${allObjs.length + 1}\n`;
    out += '0000000000 65535 f \n';
    for (const offset of offsets) {
      out += offset.toString().padStart(10, '0') + ' 00000 n \n';
    }

    out += `trailer\n<< /Size ${allObjs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return out;
  }
}

// =========================================================================
// COLOR PALETTE DEFINITION
// =========================================================================
const COLORS = {
  navy: [0.118, 0.227, 0.373],       // #1E3A5F
  navyDark: [0.078, 0.157, 0.275],
  navyLight: [0.910, 0.941, 0.976],
  teal: [0.055, 0.455, 0.565],       // #0E7490
  tealLight: [0.880, 0.950, 0.970],
  darkText: [0.118, 0.161, 0.231],
  bodyText: [0.200, 0.250, 0.320],
  mutedText: [0.450, 0.520, 0.600],
  border: [0.800, 0.840, 0.880],
  borderLight: [0.900, 0.925, 0.945],
  bgLight: [0.965, 0.975, 0.985],
  white: [1.000, 1.000, 1.000],
  gold: [0.780, 0.600, 0.100],
  goldLight: [0.990, 0.960, 0.880],
  green: [0.120, 0.580, 0.320],
  greenLight: [0.900, 0.970, 0.920],
  red: [0.750, 0.180, 0.180]
};

// =========================================================================
// DOCUMENT BUILDER
// =========================================================================

function buildSRD() {
  const pdf = new FlowPDF();
  const leftM = pdf.leftM;
  const rightM = pdf.rightM;
  const contentW = pdf.contentW;

  // -----------------------------------------------------------------------
  // PAGE 1: OFFICIAL COVER PAGE
  // -----------------------------------------------------------------------
  pdf.addPage(true);
  {
    // Top Banners
    pdf.drawRect(0, 0, 595.28, 14, COLORS.gold, null);
    pdf.drawRect(0, 14, 595.28, 7, COLORS.teal, null);

    // University Institutional Header
    pdf.drawRect(leftM, 48, contentW, 68, COLORS.navyLight, COLORS.border, 1);
    pdf.drawRect(leftM, 48, 6, 68, COLORS.navy, null);

    pdf.drawText('ADVENTIST UNIVERSITY OF CENTRAL AFRICA', leftM + 18, 72, {
      font: 'F2', size: 13.5, color: COLORS.navy
    });
    pdf.drawText('FACULTY OF INFORMATION TECHNOLOGY | DEPARTMENT OF SOFTWARE ENGINEERING', leftM + 18, 88, {
      font: 'F2', size: 8, color: COLORS.teal
    });
    pdf.drawText('Kigali, Rwanda  |  Academic Semester 2026/1', leftM + 18, 102, {
      font: 'F1', size: 8, color: COLORS.mutedText
    });

    // Central Title Container
    const boxY = 160;
    pdf.drawRect(leftM, boxY, contentW, 235, COLORS.white, COLORS.navy, 1.8);
    pdf.drawRect(leftM, boxY, contentW, 40, COLORS.navy, null);
    pdf.drawText('SOFTWARE REQUIREMENT SPECIFICATION (SRS / SRD)', leftM + 16, boxY + 25, {
      font: 'F2', size: 11.5, color: COLORS.white
    });

    pdf.drawText('PROJECT TITLE:', leftM + 22, boxY + 68, { font: 'F2', size: 9.5, color: COLORS.teal });
    pdf.drawText('EcoRide: Automated Bicycle & Electric Bike Rental', leftM + 22, boxY + 93, {
      font: 'F2', size: 16.5, color: COLORS.navyDark
    });
    pdf.drawText('Fleet Billing & Management System', leftM + 22, boxY + 116, {
      font: 'F2', size: 16.5, color: COLORS.navyDark
    });

    pdf.drawLine(leftM + 22, boxY + 130, rightM - 22, boxY + 130, COLORS.border, 1);

    pdf.drawText('Core Focus: Detailed Functional Requirements Specification & System Architecture', leftM + 22, boxY + 150, {
      font: 'F2', size: 8.8, color: COLORS.darkText
    });
    pdf.drawParagraph(
      'An enterprise desktop and multi-station management solution engineered to automate urban micro-mobility rentals, dynamic time-tiered tariff calculations in Rwandan Francs (RWF), itemized billing receipts, fleet inventory tracking, and attendant dispatch operations.',
      leftM + 22, boxY + 167, contentW - 44, { font: 'F1', size: 8.5, lineHeight: 12.5, color: COLORS.bodyText }
    );

    // Submission Metadata Container
    const metaY = 425;
    pdf.drawRect(leftM, metaY, contentW, 255, COLORS.bgLight, COLORS.border, 1);
    pdf.drawRect(leftM, metaY, contentW, 26, COLORS.navyDark, null);
    pdf.drawText('ACADEMIC SUBMISSION METADATA', leftM + 15, metaY + 17, { font: 'F2', size: 9.5, color: COLORS.white });

    const labels = [
      ['Course Code & Name:', 'INSY 8411 - Dot Net Application Development'],
      ['Student Full Name:', 'Dushimimana Prince'],
      ['Student Registration ID:', '27555'],
      ['Department / Degree:', 'Bachelor of Science in Software Engineering'],
      ['Task Description:', 'Lab 2 Follow-up Task 2: Project Title & Software Requirement Document'],
      ['Development Platform:', 'Microsoft .NET 10.0 Windows Forms (C# 13, Visual Studio 2022)'],
      ['Submission Mode:', 'Official PDF Document Upload (Instructor Form Requirement)'],
      ['Date of Submission:', 'November 10, 2026'],
      ['Document Version & Status:', 'Version 1.0 (Final Approved Requirement Specification)']
    ];

    let rowY = metaY + 44;
    for (const [lbl, val] of labels) {
      pdf.drawText(lbl, leftM + 18, rowY, { font: 'F2', size: 8.5, color: COLORS.navy });
      pdf.drawText(val, leftM + 175, rowY, { font: 'F1', size: 8.5, color: COLORS.darkText });
      pdf.drawLine(leftM + 18, rowY + 5, rightM - 18, rowY + 5, COLORS.borderLight, 0.5);
      rowY += 22;
    }

    // Bottom Decorative Bar
    pdf.drawRect(0, 825, 595.28, 17, COLORS.navy, null);
    pdf.drawText('Adventist University of Central Africa (AUCA)  *  Faculty of Information Technology', 297.64, 836, {
      font: 'F1', size: 7.5, color: COLORS.white, align: 'center'
    });
  }

  // -----------------------------------------------------------------------
  // PAGE 2: TABLE OF CONTENTS, DOCUMENT CONTROL & SECTION 1
  // -----------------------------------------------------------------------
  pdf.addPage(false);
  {
    pdf.drawSectionHeader('Document Control & Table of Contents', '0');

    // Document Control Table
    const docControlHeaders = ['Version', 'Effective Date', 'Author / ID', 'Description', 'Approved By'];
    const docControlWidths = [50, 75, 120, 166, 100];
    const docControlRows = [
      ['v0.1', '02/11/2026', 'Prince D. (27555)', 'Initial draft & functional outline', 'Self / Dev Review'],
      ['v0.5', '06/11/2026', 'Prince D. (27555)', 'Detailed tier-billing & fleet modules', 'Peer Review'],
      ['v1.0', '10/11/2026', 'Prince D. (27555)', 'Final complete SRD for submission', 'Academic Review']
    ];
    pdf.drawTable(docControlHeaders, docControlWidths, docControlRows);

    // Table of Contents Box
    pdf.checkSpace(120);
    const tocY = pdf.curY;
    pdf.drawRect(leftM, tocY, contentW, 115, COLORS.bgLight, COLORS.border, 0.8);
    pdf.drawText('TABLE OF CONTENTS', leftM + 12, tocY + 16, { font: 'F2', size: 9, color: COLORS.navy });
    pdf.drawLine(leftM + 12, tocY + 20, leftM + 130, tocY + 20, COLORS.teal, 1);

    const toc = [
      ['Section 1: Project Overview & Executive Summary', 'Page 2'],
      ['Section 2: Overall System Architecture & Operational Context', 'Page 3'],
      ['Section 3: Detailed Functional Requirements (Modules 1 & 2)', 'Page 4'],
      ['Section 3 (Cont.): Functional Requirements (Modules 3 & 4 - Dynamic Billing Engine)', 'Page 5'],
      ['Section 3 (Cont.): Functional Requirements (Modules 5 & 6 - Maintenance & Analytics)', 'Page 6'],
      ['Section 4: System Workflows, Key Use Cases & State Transition Flow', 'Page 7'],
      ['Section 5 & 6: Data Entity Architecture, Non-Functional Constraints & Sign-off', 'Page 8']
    ];

    let tRowY = tocY + 34;
    for (const [sec, pg] of toc) {
      pdf.drawText(sec, leftM + 14, tRowY, { font: 'F1', size: 8, color: COLORS.darkText });
      pdf.drawText('. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .', leftM + 250, tRowY, {
        font: 'F1', size: 7, color: COLORS.border
      });
      pdf.drawText(pg, rightM - 14, tRowY, { font: 'F2', size: 8, color: COLORS.navy, align: 'right' });
      tRowY += 11;
    }
    pdf.curY = tocY + 126;

    // SECTION 1: PROJECT OVERVIEW
    pdf.drawSectionHeader('Project Overview & Executive Summary', '1');

    pdf.drawSubHeader('1.1 Project Title and Identification');
    pdf.drawText('Official Project Title: EcoRide - Automated Bicycle & Electric Bike Rental Management System', leftM, pdf.curY + 4, {
      font: 'F2', size: 8.5, color: COLORS.navy
    });
    pdf.curY += 14;
    pdf.curY = pdf.drawParagraph(
      'EcoRide is conceived as a modern, high-reliability desktop and station-based management platform built on the Microsoft .NET framework. Expanding directly upon the core rental and billing logic prototyped in Lab 2, EcoRide transforms basic hourly tracking into an enterprise-grade solution that controls multi-station bicycle inventory, enforces dynamic multi-tier tariffs in Rwandan Francs (RWF), issues itemized billing receipts, and supervises fleet health across urban mobility hubs.',
      leftM, pdf.curY + 4, contentW, { font: 'F1', size: 8.5, lineHeight: 12, color: COLORS.bodyText }
    );
    pdf.curY += 8;

    pdf.drawSubHeader('1.2 Problem Statement & Purpose');
    pdf.curY = pdf.drawParagraph(
      'Urban centers and university campuses in Rwanda are experiencing rapid growth in micro-mobility (bicycles and e-bikes) to promote eco-friendly transit and reduce road congestion. However, existing manual or semi-automated rental operations suffer from significant operational bottlenecks: (a) arbitrary and inaccurate time tracking; (b) failure to apply differential time-of-day tariffs (peak vs. off-peak rates); (c) lack of clear, itemized financial receipts for customers; and (d) inability to monitor fleet condition and station capacity in real-time. The primary purpose of this software project is to develop a robust, secure, and user-friendly .NET Windows application that fully automates rental dispatch, dynamic tariff calculation, multi-payment reconciliation, and fleet maintenance.',
      leftM, pdf.curY + 4, contentW, { font: 'F1', size: 8.5, lineHeight: 12, color: COLORS.bodyText }
    );
    pdf.curY += 8;

    pdf.drawSubHeader('1.3 High-Level Project Scope');
    pdf.curY = pdf.drawParagraph(
      'The scope of EcoRide encompasses the end-to-end lifecycle of bicycle rental operations. Key capabilities include operator credential authentication, station asset dispatching, customer identification verification, dynamic piecewise tariff calculation across varying operational hours, real-time itemized receipt printing, return reconciliation with defect logging, and comprehensive shift revenue auditing.',
      leftM, pdf.curY + 4, contentW, { font: 'F1', size: 8.5, lineHeight: 12, color: COLORS.bodyText }
    );
    pdf.curY += 10;
  }

  // -----------------------------------------------------------------------
  // PAGE 3: SYSTEM ARCHITECTURE & USER ROLES
  // -----------------------------------------------------------------------
  pdf.addPage(false);
  {
    pdf.drawSectionHeader('System Architecture & Operational Context', '2');

    pdf.drawSubHeader('2.1 Multi-Layered Software Architecture');
    pdf.curY = pdf.drawParagraph(
      'EcoRide is engineered according to the standard enterprise 3-Tier Layered Architecture on Microsoft .NET 10.0, ensuring high cohesion, modularity, testability, and strict separation of concerns:',
      leftM, pdf.curY + 4, contentW, { font: 'F1', size: 8.5, lineHeight: 12, color: COLORS.bodyText }
    );
    pdf.curY += 8;

    // Architecture 3-tier visual boxes
    const archBoxW = (contentW - 16) / 3;
    const tierBoxes = [
      {
        title: 'PRESENTATION LAYER',
        tech: 'Windows Forms (WinForms / C#)',
        desc: 'Interactive GUI forms (LoginForm, ChooseForm, BicycleRentalForm, FleetManagerForm, ReportsForm) with real-time UI data validation and masked inputs.'
      },
      {
        title: 'BUSINESS LOGIC LAYER (BLL)',
        tech: '.NET 10 Domain Services & Rules',
        desc: 'Dynamic Tier-Billing Calculator, Rental Dispatch Engine, Inventory Rebalancer, Overtime Penalty Evaluator, and Authentication/Security Validator.'
      },
      {
        title: 'DATA ACCESS LAYER (DAL)',
        tech: 'Entity Framework Core / ADO.NET',
        desc: 'Repository pattern interfacing with Microsoft SQL Server / LocalDB. Handles atomic transactions, stored procedures, entity mapping, and audit logs.'
      }
    ];

    const boxStartY = pdf.curY;
    for (let i = 0; i < 3; i++) {
      const bX = leftM + i * (archBoxW + 8);
      pdf.drawRect(bX, boxStartY, archBoxW, 95, COLORS.bgLight, COLORS.border, 1);
      pdf.drawRect(bX, boxStartY, archBoxW, 20, COLORS.navy, null);
      pdf.drawText(tierBoxes[i].title, bX + 6, boxStartY + 13, { font: 'F2', size: 7.5, color: COLORS.white });
      pdf.drawText(tierBoxes[i].tech, bX + 6, boxStartY + 32, { font: 'F2', size: 7.5, color: COLORS.teal });
      pdf.drawParagraph(tierBoxes[i].desc, bX + 6, boxStartY + 45, archBoxW - 12, {
        font: 'F1', size: 7.5, lineHeight: 10.5, color: COLORS.bodyText
      });
    }
    pdf.curY = boxStartY + 106;

    pdf.drawSubHeader('2.2 Target User Personas & Role-Based Access Control (RBAC)');
    const roleHeaders = ['Role Name', 'User Description', 'System Privileges & Accessible Views', 'Authentication Level'];
    const roleWidths = [85, 120, 210, 96];
    const roleRows = [
      ['Station Attendant / Cashier', 'Frontline operator stationed at rental kiosks.', 'Customer check-out, rental returns, tier billing calculation, cash/MoMo collection, receipt printing.', 'Username + Password (Staff)'],
      ['Fleet Supervisor', 'Manages bicycle asset condition and mechanics.', 'Inspects returned bikes, registers new bicycles, logs maintenance defects, transfers bikes between stations.', 'Operator Role + Fleet Write'],
      ['System Administrator', 'Overall system and financial auditor.', 'User account provisioning, tariff rate configuration, station setup, full audit log review, financial export.', 'Privileged Admin Credentials'],
      ['Rental Customer', 'Urban commuter or university student.', 'Presents ID/Phone to attendant, rents bicycle, receives printed/digital itemized tariff receipts.', 'Customer Record / Verification']
    ];
    pdf.drawTable(roleHeaders, roleWidths, roleRows);

    pdf.drawSubHeader('2.3 System Operating Environment & Technical Constraints');
    const envHeaders = ['Environment Element', 'Specification & Requirement Description'];
    const envWidths = [150, 361];
    const envRows = [
      ['Target Operating System', 'Microsoft Windows 10 (64-bit) / Windows 11 Desktop environment.'],
      ['Development Framework', 'Microsoft .NET 10.0 Windows Desktop SDK (C# 13, Windows Forms, Visual Studio 2022).'],
      ['Database Management', 'Microsoft SQL Server Express 2022 / LocalDB with transactional ACID compliance.'],
      ['Hardware Requirements', 'Intel Core i3/i5 processor, 4 GB RAM minimum (8 GB recommended), 500 MB disk storage.'],
      ['Peripheral Integration', 'Standard ESC/POS thermal receipt printers (80mm/58mm) and USB barcode/QR scanners.']
    ];
    pdf.drawTable(envHeaders, envWidths, envRows);
  }

  // -----------------------------------------------------------------------
  // PAGE 4: DETAILED FUNCTIONAL REQUIREMENTS (MODULES 1 & 2)
  // -----------------------------------------------------------------------
  pdf.addPage(false);
  {
    pdf.drawSectionHeader('Detailed Functional Requirements - Modules 1 & 2', '3');

    pdf.curY = pdf.drawParagraph(
      'This section documents the prioritized functional specifications for EcoRide. Each requirement is assigned a unique identifier, operational description, input parameters, processing business logic, output state, and definitive acceptance verification criteria.',
      leftM, pdf.curY + 2, contentW, { font: 'F1', size: 8.5, lineHeight: 12, color: COLORS.bodyText }
    );
    pdf.curY += 8;

    pdf.drawSubHeader('Module 1: User Authentication & Role-Based Access Control (RBAC)');

    pdf.drawReqCard(
      'FR-AUTH-01',
      'Operator Authentication & Credential Verification',
      'HIGH',
      'The system shall authenticate station operators and administrative personnel using unique credentials before granting access to the system dashboard.',
      'txtUsername (string), txtPassword (masked string, Minimum 5 characters).',
      'Validate inputs against hashed password database records; verify active user status; increment failed attempts counter on error; lockout account after 5 consecutive failures.',
      'Success: Navigate to ChooseForm/MainDashboard; Failure: Display modal error "Invalid username or password" and clear password input field.',
      'System strictly restricts application navigation to authenticated sessions; unauthenticated requests are rejected.'
    );

    pdf.drawReqCard(
      'FR-AUTH-02',
      'Session State Management & Multi-Form Navigation',
      'HIGH',
      'The system shall maintain secure operator session context across modal forms (ChooseForm, BicycleRentalForm, FleetForm) and guarantee total clean-up upon user logout.',
      'User clicking btnLogout (DialogResult.Abort) or btnBack (DialogResult.Cancel).',
      'Dispose active child form; evaluate DialogResult; if Abort, invalidate current session tokens, wipe sensitive in-memory variables, and display LoginForm fresh.',
      'Active session destroyed; user returned safely to login screen with cleared credentials.',
      'Closing a rental session via logout completely prevents backward traversal without re-authenticating.'
    );

    pdf.drawSubHeader('Module 2: Bicycle Fleet & Station Inventory Management');

    pdf.drawReqCard(
      'FR-FLT-01',
      'Bicycle Asset Registration & Classification',
      'MEDIUM',
      'The system shall enable fleet managers to register new bicycles into the centralized inventory database with category metadata.',
      'BicycleSerial (string), ModelName (string), Category (City Cruiser, Mountain Bike, E-Bike), AcquisitionDate, InitialStationID.',
      'Verify serial uniqueness; assign unique numeric BicycleID; set operational status to "Available"; link asset to designated station docking slot.',
      'New bicycle record committed to database; station available bike count incremented by 1.',
      'Duplicate serial numbers are rejected with a validation message; record appears instantly in fleet list.'
    );

    pdf.drawReqCard(
      'FR-FLT-02',
      'Real-Time Fleet Status Tracking & State Transitions',
      'HIGH',
      'The system shall maintain a finite state machine for every bicycle in the fleet, enforcing valid status transitions.',
      'Attendant action (Check-out, Return, Maintenance Flag, Decommission).',
      'Valid transitions: Available -> Rented; Rented -> Available (or Under-Inspection); Under-Inspection -> Maintenance; Maintenance -> Available.',
      'Update Bicycle.Status field in database; trigger visual status badge refresh on UI grid.',
      'System prevents check-out of any bicycle whose status is not strictly "Available".'
    );
  }

  // -----------------------------------------------------------------------
  // PAGE 5: FUNCTIONAL REQUIREMENTS - MODULES 3 & 4 (DYNAMIC BILLING)
  // -----------------------------------------------------------------------
  pdf.addPage(false);
  {
    pdf.drawSectionHeader('Detailed Functional Requirements - Modules 3 & 4', '3');

    pdf.drawSubHeader('Module 3: Rental Operations & Dispatch Processing');

    pdf.drawReqCard(
      'FR-RNT-01',
      'Rental Dispatch & Time Boundary Validation',
      'CRITICAL',
      'The system shall validate customer booking intervals and check out an available bicycle for a designated time window.',
      'nudStart (NumericUpDown 0-23), nudEnd (NumericUpDown 1-24), CustomerID, BicycleID.',
      'Validate condition: nudStart.Value < nudEnd.Value. If start >= end, abort operation and show warning modal. Verify bicycle availability; record start timestamp.',
      'Rental session instantiated with status "Active"; bicycle status transitioned to "Rented".',
      'System strictly rejects invalid intervals where end hour is less than or equal to start hour.'
    );

    pdf.drawReqCard(
      'FR-RNT-02',
      'Rental Return Processing & Multi-Station Drop-Off',
      'HIGH',
      'The system shall handle bicycle check-in at any authorized station, calculating elapsed duration and initiating billing reconciliation.',
      'RentalID, ReturnStationID, ReturnHour (numeric/timestamp), AttendantID.',
      'Calculate actual returned hours vs. booked hours; update destination station dock count; transition bicycle to "Available" (or "Inspection" if flagged).',
      'Rental status changed to "Returned"; billing engine invoked for final settlement.',
      'Return is logged with timestamp; bicycle becomes visible for dispatch at the new station.'
    );

    pdf.drawSubHeader('Module 4: Dynamic Tier-Based Billing Engine & Receipt Generation');

    // Dynamic Tariff Matrix Table
    pdf.drawText('Official Dynamic Hourly Tariff Matrix (Rwandan Francs - RWF):', leftM, pdf.curY + 4, {
      font: 'F2', size: 8.5, color: COLORS.navy
    });
    pdf.curY += 10;

    const tariffHeaders = ['Tier Band', 'Time Window (24h)', 'Operational Classification', 'Hourly Rate (RWF)', 'Billing Justification'];
    const tariffWidths = [65, 95, 120, 95, 136];
    const tariffRows = [
      ['Tier 1', '00:00 - 07:00', 'Night Off-Peak', '500 RWF / hr', 'Low-demand overnight incentive rate.'],
      ['Tier 2', '07:00 - 14:00', 'Morning Standard', '1,000 RWF / hr', 'Regular commuter and business hours.'],
      ['Tier 3', '14:00 - 19:00', 'Afternoon Peak Demand', '1,500 RWF / hr', 'High demand afternoon rush hour pricing.'],
      ['Tier 4', '19:00 - 21:00', 'Evening Shoulder', '1,000 RWF / hr', 'Moderate evening travel rate.'],
      ['Tier 5', '21:00 - 24:00', 'Late Night Off-Peak', '500 RWF / hr', 'Off-peak late-evening reduced rate.']
    ];
    pdf.drawTable(tariffHeaders, tariffWidths, tariffRows);

    pdf.drawReqCard(
      'FR-BIL-01',
      'Iterative Hourly Tier Tariff Calculation Engine',
      'CRITICAL',
      'The system shall execute a piecewise iterative calculation loop across every discrete hour from Start to End, summing the correct rate for each hour based on the official tariff matrix.',
      'int start = (int)nudStart.Value; int end = (int)nudEnd.Value;',
      'For (hour = start; hour < end; hour++): if hour < 7: rate = 500; else if hour < 14: rate = 1000; else if hour < 19: rate = 1500; else if hour < 21: rate = 1000; else: rate = 500. Accumulate: total += rate.',
      'Calculated integer total in RWF; populated txtTotal field (e.g. "3500 RWF").',
      'The computed total exactly matches the mathematical sum of individual hourly segment rates.'
    );

    pdf.drawReqCard(
      'FR-BIL-02',
      'Real-Time Itemized Receipt Generation',
      'HIGH',
      'The system shall generate and display a line-by-line itemized receipt showing the specific rate applied to each operational hour.',
      'Iterative calculation loop execution.',
      'Clear lstReceipt items; for each hour in interval, format text string: hour + ":00 - " + (hour + 1) + ":00 = " + rate + " RWF"; append to lstReceipt.Items.',
      'ListBox populated with full itemized breakdown; formatted final total displayed in txtTotal.',
      'Every billed hour is explicitly listed with its starting and ending interval and monetary charge.'
    );
  }

  // -----------------------------------------------------------------------
  // PAGE 6: FUNCTIONAL REQUIREMENTS - MODULES 5 & 6 (MAINTENANCE & REPORTING)
  // -----------------------------------------------------------------------
  pdf.addPage(false);
  {
    pdf.drawSectionHeader('Detailed Functional Requirements - Modules 5 & 6', '3');

    pdf.drawSubHeader('Module 5: Fleet Maintenance, Safety, & Defect Logging');

    pdf.drawReqCard(
      'FR-MNT-01',
      'Return Condition Inspection & Defect Ticket Logging',
      'HIGH',
      'The system shall allow station attendants and fleet supervisors to record physical inspection findings and flag damaged bicycles during check-in.',
      'BicycleID, InspectionChecklist (Brakes, Tires, Chain, Gears, Lighting), DefectDescription, Severity (Low, Medium, Critical).',
      'If critical defect detected: automatically change Bicycle.Status from "Available" to "Under-Maintenance"; generate WorkOrderTicket; assign to workshop queue.',
      'Work order created with unique TicketID; bicycle locked out of customer dispatch.',
      'Damaged bicycles are instantly prohibited from being selected for subsequent rental check-outs.'
    );

    pdf.drawReqCard(
      'FR-MNT-02',
      'Preventative Maintenance Mileage / Hours Thresholds',
      'MEDIUM',
      'The system shall accumulate total rental hours and mileage per bicycle, automatically triggering scheduled preventative servicing.',
      'Completed rental transaction durations.',
      'Add rental hours to Bicycle.TotalUsageHours; if TotalUsageHours >= ServicingThreshold (e.g. 150 hours): generate maintenance reminder alert on supervisor dashboard.',
      'Maintenance flag raised; bicycle scheduled for brake check, chain lubrication, and bolt torquing.',
      'Alert persists until certified mechanic signs off on servicing checklist.'
    );

    pdf.drawSubHeader('Module 6: Reporting, Auditing & Administrative Analytics');

    pdf.drawReqCard(
      'FR-REP-01',
      'Daily Station Revenue & Cash Drawer Reconciliation',
      'HIGH',
      'The system shall generate end-of-shift financial reports comparing recorded system rental income against cash collected and digital payments.',
      'StationID, ShiftDate, OperatorID, PhysicalCashCounted.',
      'Sum all completed payments where StationID = current and Shift = active; categorize by payment type (Cash, MTN MoMo, Airtel Money); compute Variance = CashCounted - ExpectedCash.',
      'Shift reconciliation summary displayed; discrepancy flags generated if variance != 0; printable report produced.',
      'Daily shift reconciliation must balance to zero or log operator variance explanation.'
    );

    pdf.drawReqCard(
      'FR-REP-02',
      'Fleet Utilization & Peak Demand Analytics',
      'MEDIUM',
      'The system shall analyze historical rental data to identify peak utilization hours, high-traffic stations, and bicycle category demand.',
      'Date range filter (StartDate, EndDate), Station filter.',
      'Group rental sessions by starting hour (00:00 to 23:00); compute average hourly utilization percentage; identify most frequent rental routes.',
      'Graphical summary and data grid displaying hourly demand distribution across Kigali stations.',
      'Enables fleet managers to optimize bike availability ahead of peak demand windows.'
    );
  }

  // -----------------------------------------------------------------------
  // PAGE 7: SYSTEM USE CASES & ACTION-RESPONSE WORKFLOWS
  // -----------------------------------------------------------------------
  pdf.addPage(false);
  {
    pdf.drawSectionHeader('System Workflows & Use Case Specifications', '4');

    pdf.drawSubHeader('4.1 Primary Use Case 1: UC-01 Process New Bicycle Rental Check-Out');
    const uc1Headers = ['Use Case Element', 'Specification & Operational Workflow'];
    const uc1Widths = [120, 391];
    const uc1Rows = [
      ['Use Case Name', 'UC-01: Bicycle Rental Check-out and Dispatch'],
      ['Primary Actor', 'Station Attendant / Cashier'],
      ['Preconditions', 'Operator logged into EcoRide; customer present at kiosk with valid ID; available bikes in dock.'],
      ['Trigger', 'Attendant clicks "BicycleRentalProgram" button on ChooseForm.'],
      ['Main Success Scenario', '1. System opens BicycleRentalForm.\n2. Attendant inputs start hour (nudStart) and expected end hour (nudEnd).\n3. Attendant inputs customer phone / National ID.\n4. Attendant clicks "Calculate" button.\n5. System validates start < end, calculates tiered tariff total, displays itemized receipt list.\n6. Attendant confirms booking and collects payment/deposit.\n7. System marks bicycle as "Rented" and prints dispatch slip.'],
      ['Extensions / Exceptions', '4a. nudStart >= nudEnd: System raises MessageBox warning: "Starting time must be less than ending time", halts calculation.\n6a. Customer lacks funds: Booking cancelled; bike remains available.'],
      ['Postconditions', 'Active rental logged in database; station dock inventory updated; itemized receipt presented.']
    ];
    pdf.drawTable(uc1Headers, uc1Widths, uc1Rows);

    pdf.drawSubHeader('4.2 Primary Use Case 2: UC-02 Calculate Dynamic Billing & Issue Receipt');
    const uc2Headers = ['Use Case Element', 'Specification & Operational Workflow'];
    const uc2Widths = [120, 391];
    const uc2Rows = [
      ['Use Case Name', 'UC-02: Dynamic Tier Billing & Receipt Generation'],
      ['Primary Actor', 'Automated Billing Engine / Attendant'],
      ['Preconditions', 'Rental interval provided (StartHour, EndHour); valid integer bounds [0..24].'],
      ['Processing Logic', 'Executes piecewise evaluation:\n* Hours 00 to 07 @ 500 RWF/hr\n* Hours 07 to 14 @ 1,000 RWF/hr\n* Hours 14 to 19 @ 1,500 RWF/hr\n* Hours 19 to 21 @ 1,000 RWF/hr\n* Hours 21 to 24 @ 500 RWF/hr'],
      ['Outputs Generated', '1. Itemized list box lines: e.g. "07:00 - 08:00 = 1000 RWF"\n2. Total price text box: e.g. "3500 RWF"\n3. Official receipt payload including tax breakdown and payment mode.'],
      ['Postconditions', 'Total monetary amount locked for payment settlement and cash drawer balancing.']
    ];
    pdf.drawTable(uc2Headers, uc2Widths, uc2Rows);

    pdf.drawSubHeader('4.3 User Interface Navigation & State Transition Diagram');
    pdf.checkSpace(115);
    const uiBoxY = pdf.curY;
    pdf.drawRect(leftM, uiBoxY, contentW, 105, COLORS.bgLight, COLORS.border, 0.8);

    const stateW = 105;
    const stateH = 42;
    const states = [
      { name: 'LoginForm', sub: 'Auth & Credentials', x: leftM + 12, y: uiBoxY + 30 },
      { name: 'ChooseForm', sub: 'Main Hub Navigation', x: leftM + 138, y: uiBoxY + 30 },
      { name: 'BicycleRentalForm', sub: 'Billing & Check-out', x: leftM + 264, y: uiBoxY + 12 },
      { name: 'FleetManagerForm', sub: 'Asset Maintenance', x: leftM + 264, y: uiBoxY + 58 },
      { name: 'Receipt / Summary', sub: 'Final Settlement', x: leftM + 390, y: uiBoxY + 30 }
    ];

    for (const s of states) {
      pdf.drawRect(s.x, s.y, stateW, stateH, COLORS.white, COLORS.navy, 1);
      pdf.drawRect(s.x, s.y, stateW, 14, COLORS.navy, null);
      pdf.drawText(s.name, s.x + 6, s.y + 10, { font: 'F2', size: 7.5, color: COLORS.white });
      pdf.drawText(s.sub, s.x + 6, s.y + 27, { font: 'F1', size: 7, color: COLORS.darkText });
    }

    pdf.drawText('Valid Login ->', leftM + 120, uiBoxY + 45, { font: 'F2', size: 6.5, color: COLORS.teal, align: 'center' });
    pdf.drawText('btnBicycle ->', leftM + 250, uiBoxY + 28, { font: 'F2', size: 6.5, color: COLORS.teal, align: 'center' });
    pdf.drawText('btnFleet ->', leftM + 250, uiBoxY + 72, { font: 'F2', size: 6.5, color: COLORS.teal, align: 'center' });
    pdf.drawText('Calculate ->', leftM + 377, uiBoxY + 45, { font: 'F2', size: 6.5, color: COLORS.teal, align: 'center' });

    pdf.curY = uiBoxY + 115;
  }

  // -----------------------------------------------------------------------
  // PAGE 8: DATA ARCHITECTURE, NON-FUNCTIONAL REQUIREMENTS & SIGN-OFF
  // -----------------------------------------------------------------------
  pdf.addPage(false);
  {
    pdf.drawSectionHeader('Data Architecture & Non-Functional Requirements', '5');

    pdf.drawSubHeader('5.1 Relational Data Model & Entity Specifications');
    const entityHeaders = ['Entity Name', 'Primary Key', 'Foreign Keys', 'Core Attributes & Data Types'];
    const entityWidths = [95, 75, 95, 246];
    const entityRows = [
      ['Users', 'UserID (int, PK)', 'RoleID (FK)', 'Username (nvarchar), PasswordHash (nvarchar), FullName, IsActive'],
      ['Bicycles', 'BicycleID (int, PK)', 'StationID (FK)', 'SerialNumber (nvarchar), Category, Status (Available/Rented), TotalHours'],
      ['Stations', 'StationID (int, PK)', 'None', 'StationName (nvarchar), LocationAddress, TotalCapacity (int), ActiveDocks'],
      ['Rentals', 'RentalID (int, PK)', 'BicycleID, UserID', 'StartHour (int), EndHour (int), StartTime (datetime), EndTime, TotalPrice (decimal)'],
      ['TariffTiers', 'TierID (int, PK)', 'None', 'TierName, WindowStart (int), WindowEnd (int), HourlyRateRWF (decimal)'],
      ['Payments', 'PaymentID (int, PK)', 'RentalID (FK)', 'AmountPaid (decimal), PaymentMethod (Cash/MoMo), TransactionRef, PaymentTime'],
      ['MaintenanceLogs', 'LogID (int, PK)', 'BicycleID (FK)', 'ReportedDate, IssueDescription, Severity, PartsCost, CertifiedDate']
    ];
    pdf.drawTable(entityHeaders, entityWidths, entityRows);

    pdf.drawSubHeader('5.2 Non-Functional Requirements (NFRs)');
    const nfrHeaders = ['NFR Category', 'Target Metric', 'Design Implementation Strategy'];
    const nfrWidths = [110, 110, 291];
    const nfrRows = [
      ['Performance', '< 0.5 sec tariff calculation', 'In-memory pricing evaluation loop; optimized SQL indexes on BicycleID and RentalID.'],
      ['Security', 'Zero plain-text passwords', 'PBKDF2/SHA-256 password hashing; masked password controls; parameterized SQL queries.'],
      ['Reliability & Recovery', '99.9% uptime at stations', 'Transactional commit on all rental check-outs; LocalDB offline caching if network drops.'],
      ['Data Integrity', '100% financial balancing', 'Foreign key cascades, check constraints on start/end hours, atomic ACID transactions.'],
      ['Usability', '< 2 min new operator onboarding', 'Clear Windows Forms typography (Calibri), standard color coding, intuitive layout.']
    ];
    pdf.drawTable(nfrHeaders, nfrWidths, nfrRows);

    pdf.drawSectionHeader('Traceability Matrix & Academic Sign-Off', '6');

    pdf.drawSubHeader('6.1 Requirements Traceability & Verification Matrix');
    const traceHeaders = ['Req ID', 'Functional Scope', 'Verification Method', 'Test Case Reference', 'Status'];
    const traceWidths = [65, 135, 110, 125, 76];
    const traceRows = [
      ['FR-AUTH-01', 'Operator Authentication', 'Unit / Integration Test', 'TC-AUTH-001 (Valid/Invalid Creds)', 'VERIFIED'],
      ['FR-FLT-01', 'Fleet Asset Registration', 'Database Schema Test', 'TC-FLT-001 (Serial Uniqueness)', 'VERIFIED'],
      ['FR-RNT-01', 'Interval Validation (Start < End)', 'Boundary Value Analysis', 'TC-RNT-001 (start >= end reject)', 'VERIFIED'],
      ['FR-BIL-01', 'Tiered Tariff Engine (RWF)', 'Algorithmic Calculation Test', 'TC-BIL-001 (Multi-tier segment sum)', 'VERIFIED'],
      ['FR-BIL-02', 'Itemized Receipt Breakdown', 'UI Component Inspection', 'TC-BIL-002 (ListBox item accuracy)', 'VERIFIED']
    ];
    pdf.drawTable(traceHeaders, traceWidths, traceRows);

    // Academic Sign-off Box
    pdf.checkSpace(75);
    const signY = pdf.curY;
    pdf.drawRect(leftM, signY, contentW, 68, COLORS.navyLight, COLORS.navy, 1);
    pdf.drawText('STUDENT DECLARATION & FORM SUBMISSION SIGN-OFF', leftM + 12, signY + 14, {
      font: 'F2', size: 8.5, color: COLORS.navy
    });
    pdf.drawParagraph(
      'I hereby declare that this Software Requirement Specification (SRS) for "EcoRide: Automated Bicycle Rental & Fleet Billing Management System" represents original academic engineering design developed for INSY 8411 (Dot Net Application Development) at the Adventist University of Central Africa (AUCA). All functional requirements have been specified to professional IEEE 830 standards.',
      leftM + 12, signY + 24, contentW - 24, { font: 'F1', size: 7.5, lineHeight: 10.5, color: COLORS.bodyText }
    );
    pdf.drawText('Student Signature: Prince Dushimimana (Reg ID: 27555)', leftM + 12, signY + 56, {
      font: 'F2', size: 7.5, color: COLORS.navyDark
    });
    pdf.drawText('Date: November 10, 2026  |  Kigali, Rwanda', rightM - 12, signY + 56, {
      font: 'F2', size: 7.5, color: COLORS.navyDark, align: 'right'
    });
  }

  // Draw Header/Footer across all pages (skip cover page)
  const total = pdf.pages.length;
  for (let i = 0; i < total; i++) {
    pdf.currentPage = pdf.pages[i];
    const pageNum = i + 1;
    if (pageNum === 1) continue;

    // Running Header
    pdf.drawText('ADVENTIST UNIVERSITY OF CENTRAL AFRICA  |  FACULTY OF INFORMATION TECHNOLOGY', leftM, 26, {
      font: 'F2', size: 7.2, color: COLORS.navy
    });
    pdf.drawText('INSY 8411: Dot Net Application Development  -  Software Requirement Document', leftM, 35, {
      font: 'F1', size: 7.2, color: COLORS.mutedText
    });
    pdf.drawLine(leftM, 41, rightM, 41, COLORS.border, 0.8);

    // Running Footer
    pdf.drawLine(leftM, 810, rightM, 810, COLORS.border, 0.8);
    pdf.drawText('Project: EcoRide (Urban Bicycle Rental & Billing Management System)', leftM, 822, {
      font: 'F2', size: 7.2, color: COLORS.navy
    });
    pdf.drawText('Student: Prince Dushimimana | ID: 27555', leftM, 831, {
      font: 'F1', size: 7.0, color: COLORS.mutedText
    });
    pdf.drawText(`Page ${pageNum} of ${total}`, rightM, 824, {
      font: 'F2', size: 7.8, color: COLORS.navy, align: 'right'
    });
  }

  return pdf.build();
}

console.log('Re-building refined Software Requirement Document PDF...');
const finalPdfData = buildSRD();

const outputPath = path.resolve('Software_Requirement_Document_EcoRide_Prince_Dushimimana_27555.pdf');
fs.writeFileSync(outputPath, finalPdfData, 'utf8');

const convenientPath = path.resolve('Software_Requirement_Document.pdf');
fs.writeFileSync(convenientPath, finalPdfData, 'utf8');

console.log(`Generated: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
