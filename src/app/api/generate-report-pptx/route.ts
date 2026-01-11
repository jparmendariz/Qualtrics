import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

// Office Theme Colors (from Basic Shell template)
const COLORS = {
  // Primary Office colors
  primary: "4472C4",      // Office Blue
  primaryDark: "2F5496",  // Darker blue
  orange: "ED7D31",       // Office Orange
  gray: "A5A5A5",         // Gray
  gold: "FFC000",         // Gold
  mediumBlue: "5B9BD5",   // Medium Blue
  green: "70AD47",        // Green
  // Text colors
  dark: "000000",         // Black
  darkBlue: "44546A",     // Dark Blue for text
  lightGray: "E7E6E6",    // Light Gray
  white: "FFFFFF",
  // Chart colors
  chartBlue: "4472C4",
  chartOrange: "ED7D31",
  chartGray: "A5A5A5",
  chartGold: "FFC000",
  chartGreen: "70AD47",
};

interface ReportData {
  clientName: string;
  projectName: string;
  oppName?: string;
  researchManager: string;
  rmEmail?: string;
  methodology?: string;
  sampleSize?: string;
  targetAudience?: string;
  objectives?: string;
  fieldDates?: string;
  surveyLength?: string;
  // Insights content
  executiveSummary?: string;
  keyFindings?: string[];
  recommendations?: string[];
  // Additional sections
  background?: string;
  respondentProfile?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ReportData = await request.json();

    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = "RX Hub - Qualtrics";
    pptx.title = `${data.clientName} - Research Report`;
    pptx.subject = data.projectName || data.oppName || "Research Report";
    pptx.company = "Qualtrics";

    // Define master slide layouts
    pptx.defineSlideMaster({
      title: "TITLE_SLIDE",
      background: { color: COLORS.primary },
    });

    pptx.defineSlideMaster({
      title: "SECTION_HEADER",
      background: { color: COLORS.primaryDark },
    });

    pptx.defineSlideMaster({
      title: "CONTENT_SLIDE",
      background: { color: COLORS.white },
    });

    // ========== SLIDE 1: Cover ==========
    const slide1 = pptx.addSlide({ masterName: "TITLE_SLIDE" });

    // Main title
    slide1.addText(data.projectName || data.oppName || "Research Report", {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1,
      fontSize: 40,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });

    // Client name
    slide1.addText(data.clientName, {
      x: 0.5,
      y: 3.6,
      w: 9,
      h: 0.6,
      fontSize: 24,
      color: COLORS.white,
      fontFace: "Arial",
    });

    // Year
    slide1.addText(new Date().getFullYear().toString(), {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.5,
      fontSize: 18,
      color: COLORS.lightGray,
      fontFace: "Arial",
    });

    // ========== SLIDE 2: Table of Contents ==========
    const slide2 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide2.addText("Table of Contents", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    const tocItems = [
      { num: "01", title: "Background & Methodology" },
      { num: "02", title: "Executive Summary" },
      { num: "03", title: "Key Findings" },
      { num: "04", title: "Detailed Results" },
      { num: "05", title: "Recommendations" },
      { num: "06", title: "Appendix" },
    ];

    tocItems.forEach((item, index) => {
      slide2.addText(item.num, {
        x: 0.5,
        y: 1.2 + index * 0.7,
        w: 0.8,
        h: 0.5,
        fontSize: 20,
        bold: true,
        color: COLORS.primary,
        fontFace: "Arial",
      });

      slide2.addText(item.title, {
        x: 1.4,
        y: 1.2 + index * 0.7,
        w: 8,
        h: 0.5,
        fontSize: 18,
        color: COLORS.darkBlue,
        fontFace: "Arial",
      });
    });

    // ========== SLIDE 3: Background & Methodology Section Header ==========
    const slide3 = pptx.addSlide({ masterName: "SECTION_HEADER" });

    slide3.addText("01", {
      x: 0.5,
      y: 1.8,
      w: 2,
      h: 1,
      fontSize: 60,
      bold: true,
      color: COLORS.gold,
      fontFace: "Arial",
    });

    slide3.addText("Background &\nMethodology", {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1.2,
      fontSize: 36,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });

    // ========== SLIDE 4: Research Objectives ==========
    const slide4 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide4.addText("Research Objectives", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    // Parse objectives into bullets
    const objectives = data.objectives?.split("\n").filter(line => line.trim()) || [
      "Understand customer perceptions and preferences",
      "Evaluate brand awareness and consideration",
      "Identify key drivers of purchase behavior",
      "Measure satisfaction and loyalty metrics",
    ];

    objectives.forEach((obj, index) => {
      slide4.addText(`• ${obj.replace(/^[•\-\*]\s*/, "")}`, {
        x: 0.5,
        y: 1.1 + index * 0.6,
        w: 9,
        h: 0.5,
        fontSize: 16,
        color: COLORS.darkBlue,
        fontFace: "Arial",
      });
    });

    // ========== SLIDE 5: Methodology ==========
    const slide5 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide5.addText("Methodology", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    // Methodology details table
    const methodologyData: { key: string; value: string }[] = [
      { key: "Methodology", value: data.methodology || "Quantitative Online Survey" },
      { key: "Sample Size", value: data.sampleSize ? `N = ${data.sampleSize}` : "TBD" },
      { key: "Target Audience", value: data.targetAudience || "General consumers" },
      { key: "Survey Length", value: data.surveyLength || "15-20 minutes" },
      { key: "Field Dates", value: data.fieldDates || "TBD" },
    ];

    const methodTable = methodologyData.map(item => [
      { text: item.key, options: { bold: true, color: COLORS.darkBlue, fill: { color: COLORS.lightGray } } },
      { text: item.value, options: { color: COLORS.dark } },
    ]);

    slide5.addTable(methodTable, {
      x: 0.5,
      y: 1.1,
      w: 9,
      colW: [3, 6],
      border: { pt: 0.5, color: COLORS.lightGray },
      fontFace: "Arial",
      fontSize: 14,
    });

    // Statistical note
    slide5.addText("Note: Results are statistically significant at 95% confidence level unless otherwise noted.", {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.4,
      fontSize: 11,
      italic: true,
      color: COLORS.gray,
      fontFace: "Arial",
    });

    // ========== SLIDE 6: Respondent Profile ==========
    const slide6 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide6.addText("Respondent Profile", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    // Placeholder for respondent demographics
    slide6.addText("Demographics breakdown will be populated with actual data", {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 0.5,
      fontSize: 14,
      italic: true,
      color: COLORS.gray,
      fontFace: "Arial",
    });

    // Sample demographic boxes
    const demoBoxes = [
      { title: "Gender", items: ["Male: 50%", "Female: 50%"] },
      { title: "Age", items: ["18-34: 35%", "35-54: 40%", "55+: 25%"] },
      { title: "Region", items: ["North: 25%", "South: 25%", "East: 25%", "West: 25%"] },
    ];

    demoBoxes.forEach((box, index) => {
      slide6.addShape("rect", {
        x: 0.5 + index * 3.2,
        y: 1.8,
        w: 3,
        h: 2.5,
        fill: { color: COLORS.lightGray },
        line: { color: COLORS.primary, pt: 1 },
      });

      slide6.addText(box.title, {
        x: 0.5 + index * 3.2,
        y: 1.9,
        w: 3,
        h: 0.4,
        fontSize: 14,
        bold: true,
        align: "center",
        color: COLORS.primary,
        fontFace: "Arial",
      });

      box.items.forEach((item, itemIndex) => {
        slide6.addText(item, {
          x: 0.5 + index * 3.2,
          y: 2.4 + itemIndex * 0.4,
          w: 3,
          h: 0.4,
          fontSize: 12,
          align: "center",
          color: COLORS.darkBlue,
          fontFace: "Arial",
        });
      });
    });

    // ========== SLIDE 7: Executive Summary Section Header ==========
    const slide7 = pptx.addSlide({ masterName: "SECTION_HEADER" });

    slide7.addText("02", {
      x: 0.5,
      y: 1.8,
      w: 2,
      h: 1,
      fontSize: 60,
      bold: true,
      color: COLORS.gold,
      fontFace: "Arial",
    });

    slide7.addText("Executive Summary", {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });

    // ========== SLIDE 8: Key Takeaways ==========
    const slide8 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide8.addText("Key Takeaways", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    const keyFindings = data.keyFindings || [
      "Finding 1: [Key insight from the research]",
      "Finding 2: [Another important discovery]",
      "Finding 3: [Significant pattern or trend]",
      "Finding 4: [Actionable recommendation basis]",
    ];

    keyFindings.forEach((finding, index) => {
      // Numbered circle
      slide8.addShape("ellipse", {
        x: 0.5,
        y: 1.1 + index * 0.9,
        w: 0.5,
        h: 0.5,
        fill: { color: COLORS.primary },
      });

      slide8.addText((index + 1).toString(), {
        x: 0.5,
        y: 1.15 + index * 0.9,
        w: 0.5,
        h: 0.4,
        fontSize: 14,
        bold: true,
        align: "center",
        color: COLORS.white,
        fontFace: "Arial",
      });

      // Finding text
      slide8.addText(finding, {
        x: 1.2,
        y: 1.1 + index * 0.9,
        w: 8.3,
        h: 0.7,
        fontSize: 14,
        color: COLORS.darkBlue,
        fontFace: "Arial",
        valign: "middle",
      });
    });

    // ========== SLIDE 9: Key Findings Section Header ==========
    const slide9 = pptx.addSlide({ masterName: "SECTION_HEADER" });

    slide9.addText("03", {
      x: 0.5,
      y: 1.8,
      w: 2,
      h: 1,
      fontSize: 60,
      bold: true,
      color: COLORS.gold,
      fontFace: "Arial",
    });

    slide9.addText("Key Findings", {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });

    // ========== SLIDE 10: Detailed Findings Placeholder ==========
    const slide10 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide10.addText("Detailed Findings", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    slide10.addText("This section will contain detailed charts and data visualizations based on research results.", {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 0.5,
      fontSize: 14,
      italic: true,
      color: COLORS.gray,
      fontFace: "Arial",
    });

    // Placeholder chart area
    slide10.addShape("rect", {
      x: 0.5,
      y: 1.8,
      w: 9,
      h: 3,
      fill: { color: COLORS.lightGray },
      line: { color: COLORS.primary, pt: 1 },
    });

    slide10.addText("[Chart Placeholder]", {
      x: 0.5,
      y: 3,
      w: 9,
      h: 0.6,
      fontSize: 16,
      align: "center",
      color: COLORS.gray,
      fontFace: "Arial",
    });

    // ========== SLIDE 11: Recommendations Section Header ==========
    const slide11 = pptx.addSlide({ masterName: "SECTION_HEADER" });

    slide11.addText("05", {
      x: 0.5,
      y: 1.8,
      w: 2,
      h: 1,
      fontSize: 60,
      bold: true,
      color: COLORS.gold,
      fontFace: "Arial",
    });

    slide11.addText("Recommendations", {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });

    // ========== SLIDE 12: Strategic Recommendations ==========
    const slide12 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide12.addText("Strategic Recommendations", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    const recommendations = data.recommendations || [
      "Recommendation 1: [Action item based on findings]",
      "Recommendation 2: [Strategic suggestion]",
      "Recommendation 3: [Implementation guidance]",
    ];

    recommendations.forEach((rec, index) => {
      // Arrow icon
      slide12.addText("→", {
        x: 0.5,
        y: 1.1 + index * 1,
        w: 0.5,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: COLORS.orange,
        fontFace: "Arial",
      });

      slide12.addText(rec, {
        x: 1.1,
        y: 1.1 + index * 1,
        w: 8.4,
        h: 0.8,
        fontSize: 14,
        color: COLORS.darkBlue,
        fontFace: "Arial",
        valign: "middle",
      });
    });

    // ========== SLIDE 13: Next Steps ==========
    const slide13 = pptx.addSlide({ masterName: "CONTENT_SLIDE" });

    slide13.addText("Next Steps", {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    const nextSteps = [
      "Review findings with stakeholder team",
      "Prioritize recommendations based on business impact",
      "Develop implementation roadmap",
      "Consider follow-up research for deeper exploration",
    ];

    nextSteps.forEach((step, index) => {
      slide13.addShape("rect", {
        x: 0.5,
        y: 1.1 + index * 0.8,
        w: 0.15,
        h: 0.5,
        fill: { color: index % 2 === 0 ? COLORS.primary : COLORS.orange },
      });

      slide13.addText(step, {
        x: 0.8,
        y: 1.1 + index * 0.8,
        w: 8.7,
        h: 0.5,
        fontSize: 14,
        color: COLORS.darkBlue,
        fontFace: "Arial",
        valign: "middle",
      });
    });

    // ========== SLIDE 14: Thank You ==========
    const slide14 = pptx.addSlide({ masterName: "TITLE_SLIDE" });

    slide14.addText("Thank You", {
      x: 0.5,
      y: 2.2,
      w: 9,
      h: 1,
      fontSize: 48,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });

    slide14.addText("Questions?", {
      x: 0.5,
      y: 3.4,
      w: 9,
      h: 0.6,
      fontSize: 24,
      color: COLORS.gold,
      fontFace: "Arial",
    });

    // Contact info
    slide14.addText(`${data.researchManager}\n${data.rmEmail || ""}`, {
      x: 0.5,
      y: 4.2,
      w: 9,
      h: 0.8,
      fontSize: 14,
      color: COLORS.lightGray,
      fontFace: "Arial",
    });

    // ========== SLIDE 15: Appendix Header ==========
    const slide15 = pptx.addSlide({ masterName: "SECTION_HEADER" });

    slide15.addText("06", {
      x: 0.5,
      y: 1.8,
      w: 2,
      h: 1,
      fontSize: 60,
      bold: true,
      color: COLORS.gold,
      fontFace: "Arial",
    });

    slide15.addText("Appendix", {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: COLORS.white,
      fontFace: "Arial",
    });

    // Generate the PowerPoint
    const pptxBuffer = await pptx.write({ outputType: "nodebuffer" });

    const fileName = `Report_${data.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pptx`;

    return new NextResponse(new Uint8Array(pptxBuffer as Buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating report PowerPoint:", error);
    return NextResponse.json(
      { error: "Failed to generate PowerPoint", details: String(error) },
      { status: 500 }
    );
  }
}
