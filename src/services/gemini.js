// Gemini API Service - Ported from Legacy HTML
// Uses gemini-2.5-flash for emotion analysis

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Analyzes a note using Gemini API and extracts emotional metadata.
 * @param {string} note - The user's meditation note.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<object|null>} - Analysis result or null.
 */
export async function analyzeNoteWithGemini(note, apiKey) {
    if (!apiKey || !note) return null;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Analyze this meditation journal entry and extract emotional metadata. Return ONLY a JSON object with these fields:
- emotions: array of emotions (e.g., "anxious", "happy", "tired", "stressed", "calm", "sad")
- causes: array of stressors/causes (e.g., "work", "family", "relationship", "health", "finances", "career")
- motivationalQuote: a supportive quote for someone feeling this way
- supportingMessage: a brief encouraging message (1-2 sentences)

Journal entry: "${note}"

Respond with ONLY the JSON, no markdown or explanation.`
                    }]
                }]
            })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const usage = data.usageMetadata || {};

        // Parse JSON from response (handles markdown wrapping)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            result.usage = usage;
            result.model = 'gemini-2.5-flash';
            return result;
        }
    } catch (error) {
        console.error('Gemini analysis error:', error);
    }
    return null;
}

/**
 * Gets motivational content for a note. Falls back to default quotes if no API key.
 * @param {string} note - The user's meditation note.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<object>} - Object with quote, support, emotions, causes, usage, model.
 */
export async function getMotivationalContent(note, apiKey) {
    if (!apiKey) {
        // Fallback quotes if no API key
        const fallbackQuotes = [
            { quote: "Peace comes from within. Do not seek it without.", support: "Take this moment to find stillness." },
            { quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", support: "Focus on your breath and let go." },
            { quote: "In the midst of movement and chaos, keep stillness inside of you.", support: "You are creating calm within." }
        ];
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }

    const analysis = await analyzeNoteWithGemini(note, apiKey);
    if (analysis) {
        return {
            quote: analysis.motivationalQuote || "Breathe deeply and find your center.",
            support: analysis.supportingMessage || "This meditation will help you.",
            emotions: analysis.emotions || [],
            causes: analysis.causes || [],
            usage: analysis.usage,
            model: analysis.model
        };
    }
    return { quote: "Find peace in this moment.", support: "You are exactly where you need to be." };
}
