import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import { calculateDeliveryDates, formatDateShort, PHASE_DURATIONS, TIMELINE_PHASES } from "@/lib/business-days";

// Qualtrics Brand Colors (from KO Deck template)
// Corrección 11: Agregado primaryLight que faltaba
const COLORS = {
  primary: "97D700",      // Qualtrics Green (accent1)
  primaryLight: "C2E98C", // Light Green for accent text
  primaryDark: "147BD1",  // Qualtrics Blue (accent3)
  cyan: "2DCCD3",         // Qualtrics Cyan (accent2)
  darkBlue: "464E7E",     // Dark Blue (accent4)
  red: "D6001C",          // Red (accent5)
  yellow: "FFCD00",       // Yellow (accent6)
  dark: "000000",         // Black
  gray: "A2AAAD",         // Gray
  lightGray: "E7E6E6",    // Light Gray
  white: "FFFFFF",
  tableHeader: "147BD1",  // Blue for table headers
  tableAlt: "E7E6E6",     // Light Gray for alternating rows
};

interface ProjectData {
  clientName: string;
  projectName: string;
  oppName?: string;
  researchManager: string;
  rmEmail?: string;  // Research Manager email
  methodology?: string;
  sampleSize?: string;
  loi?: string;
  targetAudience?: string;
  objectives?: string;
  description?: string;
  totalCost?: string;
  incidenceRate?: string;
  dossier?: string;
  // Sample confirmation data
  screeners?: string[];
  quotas?: string[];
  assumptions?: string;
  sampleType?: string;
  // Team
  clientContacts?: { name: string; email: string; role?: string }[];
  // AI-generated content
  aiContext?: string;
  // Timeline
  koStartDate?: string;  // ISO date string for KO meeting start
}

export async function POST(request: NextRequest) {
  try {
    const data: ProjectData = await request.json();

    // Create presentation
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = "RX Hub - Qualtrics";
    pptx.title = `Kick Off - ${data.clientName}`;
    pptx.subject = data.projectName || data.oppName || "Research Project";
    pptx.company = "Qualtrics";

    // Set slide size to widescreen 16:9
    pptx.defineLayout({ name: "LAYOUT_16x9", width: 10, height: 5.625 });
    pptx.layout = "LAYOUT_16x9";

    // ============================================================
    // SLIDE 1: Title Slide - Study Name and Date
    // ============================================================
    const slide1 = pptx.addSlide();
    slide1.background = { color: COLORS.primaryDark };

    // Study name / Project name
    const studyName = data.projectName || data.oppName || "Research Study";
    slide1.addText(studyName.toUpperCase(), {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 1,
      fontSize: 36,
      fontFace: "Arial",
      bold: true,
      color: COLORS.white,
      align: "center",
    });

    // Client name
    slide1.addText(data.clientName, {
      x: 0.5,
      y: 2.7,
      w: 9,
      h: 0.5,
      fontSize: 24,
      fontFace: "Arial",
      color: COLORS.primaryLight,
      align: "center",
    });

    // Date
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    slide1.addText(today, {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.4,
      fontSize: 14,
      fontFace: "Arial",
      color: COLORS.primaryLight,
      align: "center",
    });

    // "KICK OFF MEETING" subtitle
    slide1.addText("KICK OFF MEETING", {
      x: 0.5,
      y: 0.8,
      w: 9,
      h: 0.5,
      fontSize: 14,
      fontFace: "Arial",
      bold: true,
      color: COLORS.white,
      align: "center",
    });

    // ============================================================
    // SLIDE 2: Meet the Team - 3 Column Table
    // ============================================================
    const slide2 = pptx.addSlide();
    slide2.background = { color: COLORS.white };

    // Title
    slide2.addText("MEET THE TEAM", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 24,
      fontFace: "Arial",
      bold: true,
      color: COLORS.primaryDark,
    });

    // Decorative line under title
    slide2.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.85,
      w: 1.5,
      h: 0.05,
      fill: { color: COLORS.primary },
    });

    // Build team data - 3 columns: Role, Name, Contact
    const teamRows: { role: string; name: string; contact: string }[] = [];

    // Add Research Manager with email
    teamRows.push({
      role: "Research Manager",
      name: data.researchManager,
      contact: data.rmEmail || "",
    });

    // Add client contacts if available
    if (data.clientContacts && data.clientContacts.length > 0) {
      data.clientContacts.forEach(contact => {
        teamRows.push({
          role: contact.role || "Client Contact",
          name: contact.name,
          contact: contact.email,
        });
      });
    } else {
      // Placeholder rows
      teamRows.push(
        { role: "Client Lead", name: "[Name]", contact: "[Email]" },
        { role: "Research Director", name: "[Name]", contact: "[Email]" },
      );
    }

    // Table configuration
    const tableData: PptxGenJS.TableRow[] = [
      // Header row
      [
        { text: "ROLE", options: { bold: true, color: COLORS.white, fill: { color: COLORS.tableHeader }, align: "center" } },
        { text: "NAME", options: { bold: true, color: COLORS.white, fill: { color: COLORS.tableHeader }, align: "center" } },
        { text: "CONTACT", options: { bold: true, color: COLORS.white, fill: { color: COLORS.tableHeader }, align: "center" } },
      ],
    ];

    // Data rows
    teamRows.forEach((row, idx) => {
      const fillColor = idx % 2 === 0 ? COLORS.tableAlt : COLORS.white;
      tableData.push([
        { text: row.role, options: { fill: { color: fillColor }, align: "left" } },
        { text: row.name, options: { fill: { color: fillColor }, align: "left", bold: true } },
        { text: row.contact, options: { fill: { color: fillColor }, align: "left", color: COLORS.gray } },
      ]);
    });

    slide2.addTable(tableData, {
      x: 0.5,
      y: 1.1,
      w: 9,
      colW: [2.5, 3, 3.5],
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.dark,
      border: { type: "solid", pt: 0.5, color: COLORS.lightGray },
      rowH: 0.45,
    });

    // ============================================================
    // SLIDE 3: Research Objectives
    // ============================================================
    const slide3 = pptx.addSlide();
    slide3.background = { color: COLORS.white };

    // Title
    slide3.addText("RESEARCH OBJECTIVES", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 24,
      fontFace: "Arial",
      bold: true,
      color: COLORS.primaryDark,
    });

    // Decorative line
    slide3.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.85,
      w: 1.5,
      h: 0.05,
      fill: { color: COLORS.primary },
    });

    // Objectives content - ONLY use objectives field, not aiContext
    const objectivesText = data.objectives ||
      "• [Objectives not provided]";

    // Parse objectives into bullet points if not already formatted
    const objectiveLines = objectivesText.split("\n").filter(line => line.trim());

    objectiveLines.forEach((line, idx) => {
      const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();
      const yPos = 1.2 + idx * 0.55;

      // Bullet point icon
      slide3.addShape(pptx.ShapeType.ellipse, {
        x: 0.5,
        y: yPos + 0.12,
        w: 0.15,
        h: 0.15,
        fill: { color: COLORS.primary },
      });

      // Objective text
      slide3.addText(cleanLine, {
        x: 0.8,
        y: yPos,
        w: 8.5,
        h: 0.5,
        fontSize: 14,
        fontFace: "Arial",
        color: COLORS.dark,
        valign: "middle",
      });
    });

    // Target audience box at bottom if available
    if (data.targetAudience) {
      slide3.addShape(pptx.ShapeType.roundRect, {
        x: 0.5,
        y: 4.2,
        w: 9,
        h: 0.9,
        fill: { color: COLORS.tableAlt },
        line: { color: COLORS.primary, width: 1 },
      });

      slide3.addText("TARGET AUDIENCE", {
        x: 0.7,
        y: 4.3,
        w: 2,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        bold: true,
        color: COLORS.primary,
      });

      slide3.addText(data.targetAudience, {
        x: 0.7,
        y: 4.55,
        w: 8.6,
        h: 0.45,
        fontSize: 12,
        fontFace: "Arial",
        color: COLORS.dark,
      });
    }

    // ============================================================
    // SLIDE 4: Sample Confirmation - 3 Column Table
    // ============================================================
    const slide4 = pptx.addSlide();
    slide4.background = { color: COLORS.white };

    // Title
    slide4.addText("SAMPLE CONFIRMATION", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 24,
      fontFace: "Arial",
      bold: true,
      color: COLORS.primaryDark,
    });

    // Decorative line
    slide4.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.85,
      w: 1.5,
      h: 0.05,
      fill: { color: COLORS.primary },
    });

    // Sample specs row
    const specsY = 1.1;
    const specBoxWidth = 2.9;
    const specGap = 0.1;

    // Sample Size box
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: specsY,
      w: specBoxWidth,
      h: 0.7,
      fill: { color: COLORS.primaryDark },
    });
    slide4.addText("SAMPLE SIZE", {
      x: 0.5,
      y: specsY + 0.1,
      w: specBoxWidth,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      color: COLORS.primaryLight,
      align: "center",
    });
    slide4.addText(data.sampleSize ? `N = ${data.sampleSize}` : "TBD", {
      x: 0.5,
      y: specsY + 0.35,
      w: specBoxWidth,
      h: 0.3,
      fontSize: 16,
      fontFace: "Arial",
      bold: true,
      color: COLORS.white,
      align: "center",
    });

    // LOI box
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + specBoxWidth + specGap,
      y: specsY,
      w: specBoxWidth,
      h: 0.7,
      fill: { color: COLORS.primaryDark },
    });
    slide4.addText("LENGTH OF INTERVIEW", {
      x: 0.5 + specBoxWidth + specGap,
      y: specsY + 0.1,
      w: specBoxWidth,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      color: COLORS.primaryLight,
      align: "center",
    });
    slide4.addText(data.loi ? `${data.loi} min` : "TBD", {
      x: 0.5 + specBoxWidth + specGap,
      y: specsY + 0.35,
      w: specBoxWidth,
      h: 0.3,
      fontSize: 16,
      fontFace: "Arial",
      bold: true,
      color: COLORS.white,
      align: "center",
    });

    // IR box
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + (specBoxWidth + specGap) * 2,
      y: specsY,
      w: specBoxWidth,
      h: 0.7,
      fill: { color: COLORS.primaryDark },
    });
    slide4.addText("INCIDENCE RATE", {
      x: 0.5 + (specBoxWidth + specGap) * 2,
      y: specsY + 0.1,
      w: specBoxWidth,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      color: COLORS.primaryLight,
      align: "center",
    });
    slide4.addText(data.incidenceRate || "TBD", {
      x: 0.5 + (specBoxWidth + specGap) * 2,
      y: specsY + 0.35,
      w: specBoxWidth,
      h: 0.3,
      fontSize: 16,
      fontFace: "Arial",
      bold: true,
      color: COLORS.white,
      align: "center",
    });

    // 3-column table: Screeners | Quotas | Other Assumptions
    const colWidth = 3;
    const tableY = 2.0;
    const tableHeight = 3.2;

    // Column headers
    const headers = ["SCREENERS", "QUOTAS", "OTHER ASSUMPTIONS"];
    headers.forEach((header, idx) => {
      slide4.addShape(pptx.ShapeType.rect, {
        x: 0.5 + idx * colWidth,
        y: tableY,
        w: colWidth,
        h: 0.4,
        fill: { color: COLORS.primary },
      });
      slide4.addText(header, {
        x: 0.5 + idx * colWidth,
        y: tableY + 0.05,
        w: colWidth,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        bold: true,
        color: COLORS.white,
        align: "center",
      });
    });

    // Column content areas
    const contentY = tableY + 0.4;
    const contentHeight = tableHeight - 0.4;

    // Screeners column
    slide4.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: contentY,
      w: colWidth,
      h: contentHeight,
      fill: { color: COLORS.tableAlt },
      line: { color: COLORS.lightGray, width: 0.5 },
    });
    const screenersText = data.screeners && data.screeners.length > 0
      ? data.screeners.map(s => `• ${s}`).join("\n")
      : "• Age 18+\n• Primary decision maker\n• [Additional criteria]";
    slide4.addText(screenersText, {
      x: 0.6,
      y: contentY + 0.1,
      w: colWidth - 0.2,
      h: contentHeight - 0.2,
      fontSize: 10,
      fontFace: "Arial",
      color: COLORS.dark,
      valign: "top",
      breakLine: true,
    });

    // Quotas column
    slide4.addShape(pptx.ShapeType.rect, {
      x: 0.5 + colWidth,
      y: contentY,
      w: colWidth,
      h: contentHeight,
      fill: { color: COLORS.white },
      line: { color: COLORS.lightGray, width: 0.5 },
    });
    const quotasText = data.quotas && data.quotas.length > 0
      ? data.quotas.map(q => `• ${q}`).join("\n")
      : "• Gender: 50/50\n• Age: Natural fallout\n• Region: Census rep";
    slide4.addText(quotasText, {
      x: 0.6 + colWidth,
      y: contentY + 0.1,
      w: colWidth - 0.2,
      h: contentHeight - 0.2,
      fontSize: 10,
      fontFace: "Arial",
      color: COLORS.dark,
      valign: "top",
      breakLine: true,
    });

    // Other Assumptions column
    slide4.addShape(pptx.ShapeType.rect, {
      x: 0.5 + colWidth * 2,
      y: contentY,
      w: colWidth,
      h: contentHeight,
      fill: { color: COLORS.tableAlt },
      line: { color: COLORS.lightGray, width: 0.5 },
    });
    const assumptionsText = data.assumptions ||
      "• Online methodology\n• National sample\n• Single market study\n• Standard timeline";
    slide4.addText(assumptionsText, {
      x: 0.6 + colWidth * 2,
      y: contentY + 0.1,
      w: colWidth - 0.2,
      h: contentHeight - 0.2,
      fontSize: 10,
      fontFace: "Arial",
      color: COLORS.dark,
      valign: "top",
      breakLine: true,
    });

    // ============================================================
    // SLIDE 5: Timeline with Day Ranges and Delivery Dates
    // ============================================================
    const slide5 = pptx.addSlide();
    slide5.background = { color: COLORS.white };

    // Title
    slide5.addText("TIMELINE", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 24,
      fontFace: "Helvetica Neue",
      bold: true,
      color: COLORS.dark,
    });

    // Decorative line
    slide5.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.85,
      w: 1.5,
      h: 0.05,
      fill: { color: COLORS.cyan },
    });

    // Timeline phases with day ranges - compact horizontal layout
    const timelinePhases = [
      { name: "Pre-KO", duration: PHASE_DURATIONS["pre-kickoff"]?.label || "2-3 dias" },
      { name: "KO", duration: PHASE_DURATIONS["kickoff-meeting"]?.label || "1 dia" },
      { name: "Brief", duration: PHASE_DURATIONS["briefing"]?.label || "2-3 dias" },
      { name: "Survey", duration: PHASE_DURATIONS["survey-design"]?.label || "2 sem" },
      { name: "Prog", duration: PHASE_DURATIONS["programming"]?.label || "3-5 dias" },
      { name: "Soft", duration: PHASE_DURATIONS["soft-launch"]?.label || "2-3 dias" },
      { name: "Full", duration: PHASE_DURATIONS["full-launch"]?.label || "2 sem" },
      { name: "Analysis", duration: PHASE_DURATIONS["analysis-plan"]?.label || "3-5 dias" },
      { name: "Insights", duration: PHASE_DURATIONS["insights"]?.label || "3-5 dias" },
      { name: "Report", duration: PHASE_DURATIONS["report"]?.label || "2-3 sem" },
    ];

    const timelineY = 1.1;
    const phaseWidth = 0.85;
    const phaseGap = 0.08;
    const startX = 0.5;

    // Draw connecting line
    slide5.addShape(pptx.ShapeType.rect, {
      x: startX + 0.35,
      y: timelineY + 0.3,
      w: (phaseWidth + phaseGap) * 9 + 0.3,
      h: 0.06,
      fill: { color: COLORS.lightGray },
    });

    timelinePhases.forEach((phase, idx) => {
      const xPos = startX + idx * (phaseWidth + phaseGap);
      const isFirst = idx === 0;

      // Phase circle
      slide5.addShape(pptx.ShapeType.ellipse, {
        x: xPos + (phaseWidth - 0.65) / 2,
        y: timelineY,
        w: 0.65,
        h: 0.65,
        fill: { color: isFirst ? COLORS.primary : COLORS.primaryDark },
        line: { color: isFirst ? COLORS.primary : COLORS.primaryDark, width: 2 },
      });

      // Phase number
      slide5.addText(String(idx + 1), {
        x: xPos + (phaseWidth - 0.65) / 2,
        y: timelineY + 0.1,
        w: 0.65,
        h: 0.45,
        fontSize: 14,
        fontFace: "Arial",
        bold: true,
        color: COLORS.white,
        align: "center",
      });

      // Phase name
      slide5.addText(phase.name, {
        x: xPos - 0.1,
        y: timelineY + 0.75,
        w: phaseWidth + 0.2,
        h: 0.35,
        fontSize: 8,
        fontFace: "Arial",
        bold: true,
        color: COLORS.dark,
        align: "center",
      });

      // Duration label
      slide5.addText(phase.duration, {
        x: xPos - 0.1,
        y: timelineY + 1.05,
        w: phaseWidth + 0.2,
        h: 0.25,
        fontSize: 7,
        fontFace: "Arial",
        color: COLORS.gray,
        align: "center",
      });
    });

    // ============================================================
    // Delivery Dates Table (based on KO start date)
    // ============================================================
    const koDate = data.koStartDate ? new Date(data.koStartDate) : new Date();
    const deliveryDates = calculateDeliveryDates(koDate);

    // Table title
    slide5.addText("FECHAS ESTIMADAS DE ENTREGA", {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 0.35,
      fontSize: 12,
      fontFace: "Helvetica Neue",
      bold: true,
      color: COLORS.primaryDark,
    });

    // KO Start date note
    slide5.addText(`Basado en Kick Off: ${formatDateShort(koDate)}`, {
      x: 0.5,
      y: 2.8,
      w: 9,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      italic: true,
      color: COLORS.gray,
    });

    // Build delivery dates table
    const deliveryTableData: PptxGenJS.TableRow[] = [
      // Header row
      [
        { text: "FASE", options: { bold: true, color: COLORS.white, fill: { color: COLORS.tableHeader }, align: "center", fontSize: 9 } },
        { text: "ENTREGA", options: { bold: true, color: COLORS.white, fill: { color: COLORS.tableHeader }, align: "center", fontSize: 9 } },
        { text: "FASE", options: { bold: true, color: COLORS.white, fill: { color: COLORS.tableHeader }, align: "center", fontSize: 9 } },
        { text: "ENTREGA", options: { bold: true, color: COLORS.white, fill: { color: COLORS.tableHeader }, align: "center", fontSize: 9 } },
      ],
    ];

    // Split phases into two columns for compact display
    const leftPhases = [
      { name: "Pre-Kick Off", key: "pre-kickoff" },
      { name: "KO Meeting", key: "kickoff-meeting" },
      { name: "Briefing", key: "briefing" },
      { name: "Survey Design", key: "survey-design" },
      { name: "Programming", key: "programming" },
    ];
    const rightPhases = [
      { name: "Soft Launch", key: "soft-launch" },
      { name: "Full Launch", key: "full-launch" },
      { name: "Analysis Plan", key: "analysis-plan" },
      { name: "Insights", key: "insights" },
      { name: "Report Final", key: "report" },
    ];

    for (let i = 0; i < leftPhases.length; i++) {
      const left = leftPhases[i];
      const right = rightPhases[i];
      const fillColor = i % 2 === 0 ? COLORS.tableAlt : COLORS.white;

      deliveryTableData.push([
        { text: left.name, options: { fill: { color: fillColor }, align: "left", fontSize: 9 } },
        { text: formatDateShort(deliveryDates[left.key] || koDate), options: { fill: { color: fillColor }, align: "center", fontSize: 9, bold: true, color: COLORS.primaryDark } },
        { text: right.name, options: { fill: { color: fillColor }, align: "left", fontSize: 9 } },
        { text: formatDateShort(deliveryDates[right.key] || koDate), options: { fill: { color: fillColor }, align: "center", fontSize: 9, bold: true, color: COLORS.primaryDark } },
      ]);
    }

    slide5.addTable(deliveryTableData, {
      x: 0.5,
      y: 3.1,
      w: 9,
      colW: [2.5, 1.5, 2.5, 1.5],
      fontSize: 9,
      fontFace: "Arial",
      color: COLORS.dark,
      border: { type: "solid", pt: 0.5, color: COLORS.lightGray },
      rowH: 0.32,
    });

    // Note at bottom
    slide5.addText("* Las fechas son estimadas y excluyen fines de semana y dias festivos de Mexico y USA", {
      x: 0.5,
      y: 5.1,
      w: 9,
      h: 0.25,
      fontSize: 8,
      fontFace: "Arial",
      italic: true,
      color: COLORS.gray,
    });

    // ============================================================
    // Generate and Return PowerPoint
    // ============================================================
    const pptxBuffer = await pptx.write({ outputType: "arraybuffer" }) as ArrayBuffer;

    const fileName = `KO_Deck_${data.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pptx`;

    return new NextResponse(pptxBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PowerPoint:", error);
    return NextResponse.json(
      { error: "Failed to generate PowerPoint", details: String(error) },
      { status: 500 }
    );
  }
}
