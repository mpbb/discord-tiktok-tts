import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";

export async function fetchSpeechResource(voice: string, text: string): Promise<AudioResource> {
    try {
        const response = await fetch(process.env.TIKTOK_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                voice: voice,
                text: text
            })
        });
        const body = await response.json();
        if (body.success === false) {
            throw new Error(body.error);
        }
        return createAudioResource(`data:audio/mpeg;base64,${body.data}`, {
            inputType: StreamType.Arbitrary
        });
    } catch (error) {
        return Promise.reject(error);
    }
}