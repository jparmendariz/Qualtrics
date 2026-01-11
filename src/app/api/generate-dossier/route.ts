import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const DOSSIER_PROMPT = `
Eres un Research Analyst senior especializado en inteligencia de mercados y negocios.

Con la siguiente informacion de un proyecto de investigacion, genera un Dossier de Contexto completo.

INFORMACION DEL PROYECTO:
{{PROJECT_INFO}}

Genera un dossier estructurado con las siguientes secciones:

# DOSSIER DE CONTEXTO: {{CLIENT_NAME}}

## 1. Resumen Ejecutivo
[3-5 lineas resumiendo el proyecto, cliente y objetivo]

## 2. Sobre la Empresa
- Nombre: [Nombre de la empresa]
- Industria: [Industria principal]
- Modelo de negocio: [Descripcion breve]
- Presencia de mercado: [Regional/Nacional/Global]

## 3. Contexto de la Investigacion
### Objetivo del Proyecto
[Descripcion del objetivo basado en el target audience y tipo de proyecto]

### Preguntas Clave a Responder
1. [Pregunta 1]
2. [Pregunta 2]
3. [Pregunta 3]

### Hipotesis Iniciales
- [Hipotesis 1]
- [Hipotesis 2]

## 4. Target Audience
### Perfil del Respondente
[Descripcion basada en los criterios de screener y quotas]

### Criterios de Segmentacion
[Basado en las quotas proporcionadas]

## 5. Contexto de Industria
### Tendencias Relevantes
1. [Tendencia 1]
2. [Tendencia 2]
3. [Tendencia 3]

### Competidores Potenciales
[Basado en la industria identificada]

## 6. Consideraciones para el Research
### Retos Potenciales
- [Reto 1]
- [Reto 2]

### Oportunidades
- [Oportunidad 1]
- [Oportunidad 2]

## 7. Especificaciones del Proyecto
- Sample Size: {{N}}
- Incidence Rate: {{IR}}
- LOI: {{LOI}} minutos
- Costo: {{COST}}

## 8. Equipo y Contactos
- Contacto Qualtrics: {{CONTACT}}

---
Generado automaticamente por RX Hub con Gemini AI

IMPORTANTE:
- Se especifico y relevante basado en la informacion proporcionada
- Infiere informacion logica cuando sea necesario
- Mantene un tono profesional pero accesible
- Incluye insights accionables
`;

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();

    if (!projectData) {
      return NextResponse.json(
        { error: "No se proporciono informacion del proyecto" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no configurada" },
        { status: 500 }
      );
    }

    // Build project info string
    const projectInfo = `
- Project ID: ${projectData.projectId || "No especificado"}
- Cliente: ${projectData.clientName || "No especificado"}
- Nombre del Proyecto: ${projectData.projectName || "No especificado"}
- Tipo de Proyecto: ${projectData.projectType || "Research Services"}
- Target Audience: ${projectData.targetAudience || "No especificado"}
- Quotas: ${projectData.quotas?.join(", ") || "No especificadas"}
- Servicios Incluidos: ${projectData.servicesIncluded?.join(", ") || "No especificados"}
- Sample Size (N): ${projectData.sampleSize || "No especificado"}
- Incidence Rate: ${projectData.incidenceRate || "No especificado"}
- LOI: ${projectData.loi || "No especificado"} minutos
- Costo Total: USD ${projectData.totalCost || "No especificado"}
- Contacto: ${projectData.contactName || "No especificado"} (${projectData.contactEmail || ""})
`;

    // Build the final prompt
    const finalPrompt = DOSSIER_PROMPT
      .replace("{{PROJECT_INFO}}", projectInfo)
      .replace("{{CLIENT_NAME}}", projectData.clientName || "Cliente")
      .replace("{{N}}", projectData.sampleSize || "N/A")
      .replace("{{IR}}", projectData.incidenceRate || "N/A")
      .replace("{{LOI}}", projectData.loi || "N/A")
      .replace("{{COST}}", `USD ${projectData.totalCost || "N/A"}`)
      .replace("{{CONTACT}}", `${projectData.contactName || ""} (${projectData.contactEmail || ""})`);

    // Use Gemini 1.5 Pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const dossierContent = response.text();

    // Store the project and dossier (in a real app, this would go to a database)
    const savedProject = {
      id: projectData.projectId || `proj_${Date.now()}`,
      ...projectData,
      dossier: dossierContent,
      createdAt: new Date().toISOString(),
      status: "active",
      currentPhase: "pre-kickoff",
    };

    return NextResponse.json({
      success: true,
      project: savedProject,
      dossier: dossierContent,
    });
  } catch (error) {
    console.error("Error generating dossier:", error);
    return NextResponse.json(
      { error: "Error al generar el dossier" },
      { status: 500 }
    );
  }
}
