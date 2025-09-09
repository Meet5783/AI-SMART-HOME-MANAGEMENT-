import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Device } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const automationRuleSchema = {
  type: Type.OBJECT,
  properties: {
    trigger: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "Type of trigger, e.g., 'time', 'device_state'." },
        value: { type: Type.STRING, description: "Value for the trigger, e.g., 'sunset', 'on'." },
        condition: { type: Type.STRING, description: "Optional condition, e.g., 'is_home'." },
      },
      required: ['type', 'value'],
    },
    action: {
      type: Type.OBJECT,
      properties: {
        deviceId: { type: Type.STRING, description: "The ID of the device to control, e.g., 'living-room-light'." },
        command: { type: Type.STRING, description: "The command to execute, e.g., 'turn_on', 'set_temperature_22'." },
      },
      required: ['deviceId', 'command'],
    },
  },
  required: ['trigger', 'action'],
};

export const createAutomationRuleFromText = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following user request into a structured automation rule. The available device IDs are: living-room-light, kitchen-light, main-thermostat, bedroom-plug, front-door-camera, backyard-camera, office-desk-light, master-bedroom-thermostat. User request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: automationRuleSchema,
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
      throw new Error("API returned an empty response.");
    }

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error creating automation rule:", error);
    throw new Error("Failed to parse automation rule. Example: 'When the sun sets, turn on the living room light.'");
  }
};

export const initChat = (devices: Device[]): Chat => {
    const deviceList = devices.map(d => `- ${d.name} (ID: ${d.id}, Type: ${d.type}, Room: ${d.room}, Status: ${d.status})`).join('\n');

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are Nexa, a smart home AI assistant for the NexusHome AI system. You can answer questions about the home status and control devices.
            Current UTC time is ${new Date().toISOString()}.
            Here is a list of all available devices:
            ${deviceList}
            
            When asked to perform an action, respond with a confirmation message in natural language.
            When asked for information, provide it concisely based on the device list.`,
        },
    });
};