import Groq from "groq-sdk";

export const groq = new Groq();

export async function getTranscript(input: File) {

	try {
		const { text } = await groq.audio.transcriptions.create({
			file: input,
			model: "whisper-large-v3",
		});

		return text.trim() || null;
	} catch {
		return null; // Empty audio file
	}
}