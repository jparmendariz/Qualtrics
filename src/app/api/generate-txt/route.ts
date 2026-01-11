import { NextRequest, NextResponse } from "next/server";

interface TxtRequest {
  surveyContent: string;
  projectName?: string;
  clientName?: string;
}

/**
 * Convert survey content to Qualtrics Advanced Text Format
 * Format specifications based on Qualtrics TXT import requirements
 *
 * Corrección 8-9: Output limpio sin comentarios // ni headers innecesarios
 */
function convertToQualtricsFormat(content: string, projectName?: string, clientName?: string): string {
  // Corrección 8: Limpiar content de caracteres no deseados
  let cleanContent = content
    .replace(/```[\w]*\n?/g, "") // Quitar ``` y ```txt etc
    .replace(/```/g, ""); // Quitar cualquier ``` restante

  const lines = cleanContent.split("\n");
  const output: string[] = [];

  // Corrección 9: Empezar directamente con AdvancedFormat y Embedded Data requeridos
  output.push("[[AdvancedFormat]]");
  output.push("");
  output.push("[[ED:opp:UPDATEHERE]]");
  output.push("[[ED:Q_TotalDuration]]");
  output.push("[[ED:Q_BallotBoxStuffing]]");
  output.push("[[ED:Q_DuplicateRespondent]]");
  output.push("[[ED:Q_QualityScore]]");
  output.push("[[ED:QPMID]]");
  output.push("");

  let questionNumber = 1;
  let currentBlock = "";
  let inQuestion = false;
  let currentQuestionType = "MC"; // Default to Multiple Choice

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines at the start (ahora tenemos más líneas por los ED)
    if (!line && output.length <= 10) continue;

    // Corrección 8: Saltar líneas que empiecen con // (comentarios)
    if (line.startsWith("//")) continue;

    // Detect block headers (## Block Name or BLOCK: Name)
    const blockMatch = line.match(/^(?:##\s*|BLOCK:\s*|SECTION:\s*)(.+)$/i);
    if (blockMatch) {
      if (currentBlock) {
        output.push("");
        output.push("[[Block]]");
      }
      currentBlock = blockMatch[1].trim();
      output.push("");
      output.push(`[[Block:${currentBlock}]]`);
      output.push("");
      continue;
    }

    // Detect question headers (Q1., Q1:, Q1), 1., etc.)
    const questionMatch = line.match(/^(?:Q(\d+)[.:\)]?\s*|(\d+)[.)\s]+)(.+)$/i);
    if (questionMatch) {
      if (inQuestion) {
        output.push("");
      }

      const qNum = questionMatch[1] || questionMatch[2] || questionNumber;
      const qText = questionMatch[3].trim();

      // Detect question type from text
      currentQuestionType = detectQuestionType(qText, lines.slice(i + 1, i + 10).join("\n"));

      output.push(`[[Question:${currentQuestionType}:Q${qNum}]]`);
      output.push(qText);

      questionNumber++;
      inQuestion = true;
      continue;
    }

    // Detect standalone question text (lines ending with ?)
    if (line.endsWith("?") && !line.startsWith("-") && !line.startsWith("•") && !line.match(/^\d+\)/)) {
      if (inQuestion) {
        output.push("");
      }

      currentQuestionType = detectQuestionType(line, lines.slice(i + 1, i + 10).join("\n"));
      output.push(`[[Question:${currentQuestionType}:Q${questionNumber}]]`);
      output.push(line);

      questionNumber++;
      inQuestion = true;
      continue;
    }

    // Detect answer choices (- option, • option, a) option, 1) option)
    const choiceMatch = line.match(/^(?:[-•*]\s*|[a-z]\)\s*|\d+\)\s*)(.+)$/i);
    if (choiceMatch && inQuestion) {
      output.push(`[[Choice]]`);
      output.push(choiceMatch[1].trim());
      continue;
    }

    // Detect scale instructions or matrix rows (ignorar - no son parte del TXT)
    if (line.startsWith("[") && line.endsWith("]")) {
      continue;
    }

    // Detect instructions in parentheses (ignorar)
    if (line.startsWith("(") && line.endsWith(")")) {
      continue;
    }

    // Detect SCREENER markers (ignorar - no poner como comentario)
    if (line.toUpperCase().includes("SCREENER") || line.toUpperCase().includes("TERMINATE")) {
      continue;
    }

    // Detect skip logic markers
    if (line.toUpperCase().includes("SKIP TO") || line.toUpperCase().includes("GO TO")) {
      output.push(`[[PageBreak]]`);
      continue;
    }

    // Pass through other content
    if (line) {
      output.push(line);
    } else if (inQuestion) {
      output.push("");
    }
  }

  // End of survey (sin comentario)
  output.push("");
  output.push("[[Block]]");
  output.push("");

  return output.join("\n");
}

/**
 * Detect question type based on question text and following content
 */
function detectQuestionType(questionText: string, followingContent: string): string {
  const text = questionText.toLowerCase();
  const following = followingContent.toLowerCase();

  // Text entry / Open-ended
  if (text.includes("please specify") ||
      text.includes("please describe") ||
      text.includes("please explain") ||
      text.includes("in your own words") ||
      text.includes("open-ended") ||
      text.includes("verbatim")) {
    return "TE"; // Text Entry
  }

  // Multiple answer / Select all
  if (text.includes("select all") ||
      text.includes("check all") ||
      text.includes("multiple answers") ||
      text.includes("selecciona todos") ||
      text.includes("marca todos")) {
    return "MA"; // Multiple Answer
  }

  // Matrix / Grid
  if (text.includes("rate each") ||
      text.includes("for each of the following") ||
      text.includes("on a scale") ||
      following.includes("strongly agree") ||
      following.includes("muy de acuerdo")) {
    return "Matrix"; // Matrix Single Answer
  }

  // Ranking
  if (text.includes("rank") || text.includes("order")) {
    return "RO"; // Rank Order
  }

  // Slider
  if (text.includes("slider") || text.includes("0 to 100") || text.includes("0 to 10")) {
    return "Slider";
  }

  // Net Promoter Score
  if (text.includes("recommend") && (text.includes("0 to 10") || text.includes("nps"))) {
    return "NPS";
  }

  // Default to Multiple Choice
  return "MC";
}

export async function POST(request: NextRequest) {
  try {
    const { surveyContent, projectName, clientName }: TxtRequest = await request.json();

    if (!surveyContent || !surveyContent.trim()) {
      return NextResponse.json(
        { error: "Survey content is required" },
        { status: 400 }
      );
    }

    const txtContent = convertToQualtricsFormat(surveyContent, projectName, clientName);

    const fileName = `Survey_${(clientName || "Project").replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`;

    return new NextResponse(txtContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating TXT:", error);
    return NextResponse.json(
      { error: "Failed to generate TXT file", details: String(error) },
      { status: 500 }
    );
  }
}
