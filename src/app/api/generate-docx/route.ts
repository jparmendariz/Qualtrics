import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
} from "docx";

// Document types we can generate
type DocumentType = "research-brief" | "survey-design" | "analysis-plan";

interface ProjectData {
  clientName: string;
  projectName: string;
  oppName?: string;
  researchManager: string;
  rmEmail?: string;
  methodology?: string;
  sampleSize?: string;
  loi?: string;
  targetAudience?: string;
  objectives?: string;
  description?: string;
  totalCost?: string;
  incidenceRate?: string;
  screeners?: string[];
  quotas?: string[];
  assumptions?: string;
  servicesIncluded?: string[];
  clientContacts?: { name: string; email: string; role?: string }[];
}

interface DocxRequest {
  documentType: DocumentType;
  content: string;
  projectData: ProjectData;
}

// Qualtrics brand colors (for styling)
const COLORS = {
  primary: "147BD1",    // Qualtrics Blue
  green: "97D700",      // Qualtrics Green
  dark: "000000",       // Black
  gray: "666666",       // Gray
  lightGray: "E7E6E6",  // Light Gray
};

/**
 * Generate Research Brief document
 */
function generateResearchBriefDoc(content: string, data: ProjectData): Document {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Parse objectives into bullet points
  const objectives = data.objectives?.split("\n").filter(line => line.trim()) || [];

  // Parse screeners and quotas
  const screeners = data.screeners || [];
  const quotas = data.quotas || [];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 22, // 11pt
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: "RESEARCH BRIEF",
                bold: true,
                size: 36,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Client and Project Info Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Client:", bold: true })] })],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.clientName)],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true })] })],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(today)],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Project:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.projectName || data.oppName || "")],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Research Manager:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.researchManager)],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 400, after: 200 } }),

          // Research Objectives Section
          new Paragraph({
            children: [
              new TextRun({
                text: "RESEARCH OBJECTIVES",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          ...objectives.map(obj =>
            new Paragraph({
              children: [new TextRun(obj.replace(/^[•\-\*]\s*/, "• "))],
              spacing: { after: 100 },
            })
          ),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Target Audience Section
          new Paragraph({
            children: [
              new TextRun({
                text: "TARGET AUDIENCE",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [new TextRun(data.targetAudience || "To be defined")],
            spacing: { after: 200 },
          }),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Sample Details Section
          new Paragraph({
            children: [
              new TextRun({
                text: "SAMPLE DETAILS",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Sample Size", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.sampleSize ? `N = ${data.sampleSize}` : "TBD")],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "LOI", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.loi ? `${data.loi} minutes` : "TBD")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Incidence Rate", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.incidenceRate || "TBD")],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Methodology", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.methodology || "Quantitative Online Survey")],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Screening Criteria
          new Paragraph({
            children: [
              new TextRun({
                text: "SCREENING CRITERIA",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          ...(screeners.length > 0
            ? screeners.map(s => new Paragraph({ children: [new TextRun(`• ${s}`)], spacing: { after: 100 } }))
            : [new Paragraph({ children: [new TextRun("• To be defined")], spacing: { after: 100 } })]
          ),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Quotas
          new Paragraph({
            children: [
              new TextRun({
                text: "QUOTAS",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          ...(quotas.length > 0
            ? quotas.map(q => new Paragraph({ children: [new TextRun(`• ${q}`)], spacing: { after: 100 } }))
            : [new Paragraph({ children: [new TextRun("• Natural fallout")], spacing: { after: 100 } })]
          ),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Assumptions
          new Paragraph({
            children: [
              new TextRun({
                text: "ASSUMPTIONS",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [new TextRun(data.assumptions || "Standard project assumptions apply.")],
            spacing: { after: 200 },
          }),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // AI Generated Content (if provided)
          ...(content ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "ADDITIONAL CONTEXT",
                  bold: true,
                  size: 28,
                  color: COLORS.primary,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun(content)],
              spacing: { after: 200 },
            }),
          ] : []),

          // Team Contacts
          new Paragraph({
            children: [
              new TextRun({
                text: "PROJECT TEAM",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { before: 300, after: 200 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Role", bold: true })] })],
                    shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Name", bold: true, color: "FFFFFF" })] })],
                    shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Email", bold: true, color: "FFFFFF" })] })],
                    shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Research Manager")] }),
                  new TableCell({ children: [new Paragraph(data.researchManager)] }),
                  new TableCell({ children: [new Paragraph(data.rmEmail || "")] }),
                ],
              }),
              ...(data.clientContacts || []).map(contact =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(contact.role || "Client Contact")] }),
                    new TableCell({ children: [new Paragraph(contact.name)] }),
                    new TableCell({ children: [new Paragraph(contact.email)] }),
                  ],
                })
              ),
            ],
          }),
        ],
      },
    ],
  });

  return doc;
}

/**
 * Generate Survey Design document
 */
function generateSurveyDesignDoc(content: string, data: ProjectData): Document {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Parse the survey content into sections
  const sections = content.split(/\n(?=#{1,3}\s|BLOCK|SECTION)/i);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: "SURVEY QUESTIONNAIRE",
                bold: true,
                size: 36,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Project Info
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Client:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.clientName)],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(today)],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Project:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.projectName || "")],
                    columnSpan: 3,
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 400, after: 200 } }),

          // Survey Content
          new Paragraph({
            children: [
              new TextRun({
                text: "QUESTIONNAIRE",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Parse and render the survey content
          ...content.split("\n").map(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
              return new Paragraph({ spacing: { after: 100 } });
            }

            // Check for headers
            if (trimmedLine.startsWith("###")) {
              return new Paragraph({
                children: [new TextRun({ text: trimmedLine.replace(/^###\s*/, ""), bold: true, size: 24 })],
                spacing: { before: 200, after: 100 },
              });
            }
            if (trimmedLine.startsWith("##")) {
              return new Paragraph({
                children: [new TextRun({ text: trimmedLine.replace(/^##\s*/, ""), bold: true, size: 26, color: COLORS.primary })],
                spacing: { before: 300, after: 150 },
              });
            }
            if (trimmedLine.startsWith("#")) {
              return new Paragraph({
                children: [new TextRun({ text: trimmedLine.replace(/^#\s*/, ""), bold: true, size: 28, color: COLORS.primary })],
                spacing: { before: 400, after: 200 },
              });
            }

            // Regular text
            return new Paragraph({
              children: [new TextRun(trimmedLine)],
              spacing: { after: 80 },
            });
          }),
        ],
      },
    ],
  });

  return doc;
}

/**
 * Generate Analysis Plan document
 */
function generateAnalysisPlanDoc(content: string, data: ProjectData): Document {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.clientName} - ${data.projectName}`,
                bold: true,
                size: 28,
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "ANALYSIS PLAN",
                bold: true,
                size: 36,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "OPP:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.oppName || "")],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(today)],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Sample Size:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.sampleSize ? `N = ${data.sampleSize}` : "TBD")],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Methodology:", bold: true })] })],
                    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph(data.methodology || "Quantitative")],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 400, after: 200 } }),

          // Report Specifications
          new Paragraph({
            children: [
              new TextRun({
                text: "REPORT SPECIFICATIONS",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [new TextRun("• Format: PowerPoint Presentation")],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [new TextRun("• Template: Qualtrics Standard Template")],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [new TextRun("• Statistical Testing: 95% confidence level")],
            spacing: { after: 80 },
          }),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Objectives
          new Paragraph({
            children: [
              new TextRun({
                text: "RESEARCH OBJECTIVES",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          ...(data.objectives?.split("\n").filter(l => l.trim()).map(obj =>
            new Paragraph({
              children: [new TextRun(obj.replace(/^[•\-\*]\s*/, "• "))],
              spacing: { after: 100 },
            })
          ) || [new Paragraph({ children: [new TextRun("• To be defined")], spacing: { after: 100 } })]),

          new Paragraph({ spacing: { before: 300, after: 200 } }),

          // Analysis Plan Content (AI generated)
          new Paragraph({
            children: [
              new TextRun({
                text: "ANALYSIS APPROACH",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 200 },
          }),

          // Parse and render the analysis plan content
          ...content.split("\n").map(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
              return new Paragraph({ spacing: { after: 100 } });
            }

            if (trimmedLine.startsWith("###")) {
              return new Paragraph({
                children: [new TextRun({ text: trimmedLine.replace(/^###\s*/, ""), bold: true, size: 24 })],
                spacing: { before: 200, after: 100 },
              });
            }
            if (trimmedLine.startsWith("##")) {
              return new Paragraph({
                children: [new TextRun({ text: trimmedLine.replace(/^##\s*/, ""), bold: true, size: 26, color: COLORS.primary })],
                spacing: { before: 300, after: 150 },
              });
            }
            if (trimmedLine.startsWith("#")) {
              return new Paragraph({
                children: [new TextRun({ text: trimmedLine.replace(/^#\s*/, ""), bold: true, size: 28, color: COLORS.primary })],
                spacing: { before: 400, after: 200 },
              });
            }

            return new Paragraph({
              children: [new TextRun(trimmedLine)],
              spacing: { after: 80 },
            });
          }),
        ],
      },
    ],
  });

  return doc;
}

export async function POST(request: NextRequest) {
  try {
    const { documentType, content, projectData }: DocxRequest = await request.json();

    let doc: Document;
    let fileName: string;

    switch (documentType) {
      case "research-brief":
        doc = generateResearchBriefDoc(content, projectData);
        fileName = `Research_Brief_${projectData.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.docx`;
        break;
      case "survey-design":
        doc = generateSurveyDesignDoc(content, projectData);
        fileName = `Survey_Questionnaire_${projectData.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.docx`;
        break;
      case "analysis-plan":
        doc = generateAnalysisPlanDoc(content, projectData);
        fileName = `Analysis_Plan_${projectData.clientName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.docx`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid document type" },
          { status: 400 }
        );
    }

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating Word document:", error);
    return NextResponse.json(
      { error: "Failed to generate Word document", details: String(error) },
      { status: 500 }
    );
  }
}
