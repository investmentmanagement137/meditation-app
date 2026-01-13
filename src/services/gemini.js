export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Calls Gemini API to generate a motivational quote based on user input.
 * @param {string} note - The user's start note.
 * @param {string} apiKey - The user's API key.
 * @returns {Promise<object|null>} - Structure: { quote, support, emotions, causes } or null.
 */
export async function getMotivationalContent(note, apiKey) {
    if (!apiKey) return null;

    const prompt = `Analyze this meditation intention/note: "${note}".
    1. Identify 3-5 key emotions (one word each).
    2. Identify possible causes (short phrases).
    3. Generate a short, powerful, philosophical motivational quote (max 20 words) that addresses these feelings directly but gently.
    4. Generate a "Supportive Whisper" (max 10 words) - a very short, comforting phrase like a friend whispering.

    Return JSON: { "emotions": [], "causes": [], "quote": "", "support": "" }`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const text = data.candidates[0].content.parts[0].text;
            // Fix: Parse JSON even if wrapped in markdown code blocks
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                return {
                    ...result,
                    model: 'gemini-1.5-flash',
                    usage: data.usageMetadata
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return null;
    }
}
