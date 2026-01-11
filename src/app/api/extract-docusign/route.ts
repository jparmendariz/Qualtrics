import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const EXTRACTION_PROMPT = `
Analiza este documento PDF de DocuSign Signature de Qualtrics y extrae la siguiente informacion en formato JSON.

El documento es una cotizacion de servicios de investigacion (Research Services Quote). Tiene dos secciones principales:

SECCION 1: Despues de "Qualtrics will perform the following sample services (the 'Sample Service'):" viene la informacion del proyecto:
- Sample size (N)
- Incidence Rate (IR)
- Length of Interview (LOI)
- Target Audience
- Sample Type
- Project Type
- Screeners
- Quotas (demograficas y no demograficas)

SECCION 2: Despues de la linea "------------------------------------" (corte de pagina) viene el TIPO DE SERVICIO contratado:
- "Full Service" = servicio completo (incluye analisis y reporte)
- "Sample Only" = solo muestra (sin analisis ni reporte, maximo crosstabs)
- Servicios especificos como "Reporting de 30 slides", "Data Processing", etc.

Extrae estos campos exactamente (usa null si no encuentras el dato):

{
  "projectId": "El ID del proyecto (formato QualXXXX-MMDD-NombreProyecto o similar)",
  "clientName": "Nombre de la empresa cliente",
  "projectName": "Nombre descriptivo del proyecto",
  "totalCost": "Costo total en USD (solo el numero, ej: 9940)",
  "sampleSize": "Tamano de muestra N (solo el numero)",
  "incidenceRate": "IR en porcentaje (ej: 16%)",
  "loi": "Length of Interview en minutos (solo el numero)",
  "projectType": "Tipo de proyecto (ej: Online Survey, Tracker, etc.)",
  "sampleType": "Tipo de muestra (ej: Panel Sample, Customer List, etc.)",
  "targetAudience": "Descripcion completa del target audience y criterios de screener",
  "screeners": ["Lista de criterios de screener/filtro"],
  "quotas": ["Lista de quotas demograficas y no-demograficas"],
  "serviceType": "IMPORTANTE: El tipo de servicio principal (Full Service, Sample Only, Reporting, etc.) - buscar despues de la linea ----",
  "servicesIncluded": ["Lista detallada de todos los servicios incluidos mencionados despues de ----"],
  "contactName": "Nombre del contacto de Qualtrics",
  "contactEmail": "Email del contacto de Qualtrics",
  "deliveryDate": "Fecha de entrega estimada si existe",
  "assumptions": "Resumen de las assumptions/supuestos del proyecto"
}

IMPORTANTE:
- Responde SOLO con el JSON, sin markdown ni texto adicional
- Usa comillas dobles para strings
- Para listas vacias usa []
- Para valores no encontrados usa null
- El campo "serviceType" es MUY IMPORTANTE - determina que fases del proyecto aplican
- Busca especificamente despues de "----" para encontrar el tipo de servicio
`;

export async function POST(request: NextRequest) {
  try {
    const { pdfBase64, oppName } = await request.json();

    if (!pdfBase64) {
      return NextResponse.json(
        { error: "No se proporciono el PDF" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY no configurada" },
        { status: 500 }
      );
    }

    // Use Claude to process the PDF
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            {
              type: "text",
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json(
        { error: "No se recibio respuesta de Claude" },
        { status: 500 }
      );
    }

    const text = textContent.text;

    // Parse the JSON response
    let extractedData;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.slice(7);
      }
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.slice(3);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.slice(0, -3);
      }
      cleanText = cleanText.trim();

      extractedData = JSON.parse(cleanText);
    } catch {
      console.error("Error parsing Claude response:", text);
      return NextResponse.json(
        { error: "Error al parsear la respuesta de Claude" },
        { status: 500 }
      );
    }

    // Override projectId with the provided oppName if it's more accurate
    if (oppName && (!extractedData.projectId || extractedData.projectId === null)) {
      extractedData.projectId = oppName;
    }

    // Ensure arrays are arrays
    extractedData.quotas = extractedData.quotas || [];
    extractedData.servicesIncluded = extractedData.servicesIncluded || [];
    extractedData.screeners = extractedData.screeners || [];

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("Error processing DocuSign:", error);
    return NextResponse.json(
      { error: "Error al procesar el documento" },
      { status: 500 }
    );
  }
}
