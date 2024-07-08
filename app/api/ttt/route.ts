import { NextRequest, NextResponse } from "next/server";
import { groq } from "~/lib/voice";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    console.log("form data has been received");

    if (!audioFile) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    try {

        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-large-v3",
            // prompt: "Specify context or spelling",
            response_format: "json",
            language: "en",
            temperature: 0.0,
        });

        return NextResponse.json({ transcription });

        // The rest of the function is not visible in the image
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}