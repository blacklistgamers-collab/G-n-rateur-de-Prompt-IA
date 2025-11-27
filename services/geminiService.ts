import { GoogleGenAI, GenerateContentParameters } from "@google/genai";
import { PromptType } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

// This guard is needed for TypeScript to recognize the environment variable.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-pro";

interface GeneratePromptParams {
  promptType: PromptType;
  description: string;
  file: File | null;
}

export interface GenerationResult {
    text: string;
    json: string;
}

const generateMetaPrompt = (promptType: PromptType, description: string): string => `
Tu es un ingénieur de prompt expert. Ta mission est de générer un prompt détaillé, efficace et optimisé pour un modèle d'IA, et de le structurer en JSON.

La catégorie de prompt souhaitée par l'utilisateur est : **${promptType}**.

Voici la description de son objectif :
"${description}"

Génère une réponse JSON contenant deux clés principales :
1. "prompt": Une chaîne de caractères contenant le prompt final, complet et prêt à l'emploi. Ce prompt doit être clair, spécifique, fournir du contexte, définir le format de sortie souhaité, et inclure des contraintes si nécessaire.
2. "breakdown": Un objet JSON détaillant les composants du prompt. Les clés peuvent varier selon la catégorie, mais devraient inclure des éléments comme "sujet", "contexte", "style", "parametres_techniques", "prompt_negatif", etc.

La sortie finale doit être **UNIQUEMENT** le JSON valide, sans aucun de tes propres commentaires, salutations, explications, ou démarqueurs de code comme \`\`\`json.
`;

export const generateOptimalPrompt = async ({
  promptType,
  description,
  file,
}: GeneratePromptParams): Promise<GenerationResult> => {
  try {
    const metaPrompt = generateMetaPrompt(promptType, description);
    
    let contents: GenerateContentParameters['contents'];

    if (file) {
      const base64Data = await fileToBase64(file);
      contents = { parts: [
        { text: metaPrompt },
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        }
      ]};
    } else {
      contents = metaPrompt;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        responseMimeType: "application/json",
      },
    });
    
    const responseText = response.text.trim();

    try {
        const parsedJson = JSON.parse(responseText);
        const promptText = parsedJson.prompt || '';
        const formattedJson = JSON.stringify(parsedJson, null, 2);

        if (!promptText) {
            throw new Error("La clé 'prompt' est manquante dans la réponse JSON.");
        }

        return { text: promptText, json: formattedJson };
    } catch (parseError) {
        console.error("Error parsing JSON response from Gemini:", parseError);
        return {
            text: `Le modèle a retourné une réponse JSON malformée. Veuillez réessayer.`,
            json: JSON.stringify({ 
                error: "Réponse JSON invalide de l'API.", 
                received: responseText 
            }, null, 2),
        };
    }
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
    throw new Error(errorMessage);
  }
};