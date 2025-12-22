
import { GoogleGenAI, Type } from "@google/genai";
import { TrainingSession } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTechnicalInsights = async (sessions: TrainingSession[]) => {
  if (sessions.length === 0) return "Adicione alguns treinos para receber insights do Sensei AI.";

  const recentSessions = sessions.slice(-5).map(s => ({
    title: s.title,
    date: s.date,
    type: s.type,
    positions: s.positions.join(', '),
    drills: s.drills.join(', '),
    notes: s.notes
  }));

  const prompt = `Como um mestre de Jiu-Jitsu experiente, analise meus últimos 5 treinos. 
  Preste atenção nos títulos das sessões, nas posições que tenho frequentado e nos drills que tenho praticado.
  Forneça um feedback estruturado:
  1. Análise de Equilíbrio (Posições vs Drills).
  2. Ponto de Atenção Técnica.
  3. Sugestão Prática para o próximo treino.
  
  Meus treinos recentes: ${JSON.stringify(recentSessions)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um mestre de Jiu-Jitsu faixa preta 4º grau, sábio e muito técnico. Sua linguagem é didática, focada em mecânica corporal e estratégia. Responda em Português do Brasil.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, o Sensei AI está meditando no momento. Tente novamente mais tarde.";
  }
};