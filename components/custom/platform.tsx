"use client"

import { ArrowRight, Loader, Mic, Pause, Redo, Send, Voicemail, WavesIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react"
import { Actions } from "~/components/actions"
import { TimeLine } from "../actions/timeline"
import { StateManagement } from "~/lib/state"
import { useVoiceRecorder } from "use-voice-recorder";
import { Fragment, useCallback, useState } from "react"

type FormEvent<T extends string> = React.FormEvent<HTMLFormElement> & {
    target: {
        [key in T]: { value: string }
    }
}

const Platform = () => {
    const { data, mutateAsync, isPending, reset } = api.execute.initiative.useMutation()
    const { data: dataRe, mutateAsync: mutateAsyncRe, isPending: isPendingRe } = api.execute.reInitative.useMutation()
    const { mutateAsync: mutateAsyncVoice, isPending: isPendingVoice } = api.voice.getVoiceText.useMutation({
        onSuccess: (data) => {
            console.log(data)
            setText(data)
        }
    })

    const [permissions, state] = StateManagement(e => ([e.permissions, e.userState]))
    const [text, setText] = useState("")

    const [records, updateRecords] = useState<Blob[]>([]);
    const { isRecording, stop, start } = useVoiceRecorder(async (data) => {
        const combinedFile = new File([data], "recording.webm", { type: "audio/webm" });
        console.log(combinedFile);
        // mutateAsyncVoice({ input: combinedFile });

        const formData = new FormData();
        formData.append('audio', combinedFile, 'recording.webm');

        try {
            const response = await fetch('/api/ttt', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.transcription) {
                console.log(data.transcription)
                setText(data.transcription.text ? data.transcription.text : "")
            }
        } catch (error) {
            console.error('Error sending audio to server:', error);
        }

    });

    const transcribeRecordings = useCallback(async () => {
        if (records.length === 0) {
            return;
        }

        console.log(records);
        const combinedFile = new File(records, "recording.webm", { type: "audio/webm" });
        console.log(combinedFile);
        // download this file
        setText(URL.createObjectURL(combinedFile))

        


        mutateAsyncVoice({ input: combinedFile });
    }, [records, mutateAsyncVoice]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to AI Era</CardTitle>
                <CardDescription>
                    Ai enabled banking system.
                </CardDescription>
            </CardHeader>
            {/* <CardContent>
                {!isRecording && records.length > 0 && JSON.stringify(records, null, 2)}
            </CardContent> */}

            {(data ? data : dataRe)?.executions.map((item) => {
                const key = item.key === "unknown" ? "unavailableAction" : item.key as keyof typeof Actions
                const Component = item ? Actions[key] : Fragment
                return (
                    <CardContent key={item.iteration} className="flex flex-row gap-2 py-0">
                        <TimeLine i={item.iteration} error={item.error} />
                        <Component data={item as unknown as typeof Component["arguments"]["data"]} />
                    </CardContent>
                )
            }
            )}
            <CardContent className="mt-3">
                {/* <div className="p-3 w-full">
                    {isPendingVoice ? <Loader className="animate-spin" /> : <p>{text}</p>}
                </div> */}
                <form className="w-full" onSubmit={
                    (e: FormEvent<"prompt">) => {
                        e.preventDefault()
                        mutateAsync({
                            prompt: e.target.prompt.value,
                            permissions,
                            state: state
                        })
                    }
                }>
                    <div className="flex gap-2 w-full">
                        <Input name="prompt" id="current" type="text" value={text} onChange={(e) => setText(e.target.value)} className="rounded-full flex-1" />
                        <Button type="submit" disabled={isPending || isPendingRe || isPendingVoice || isRecording} className="px-3" size={"icon"}>
                            {isPending ? <Loader className="animate-spin" /> : <ArrowRight />}
                        </Button>
                        <Button type="button" onClick={async () => {
                            await mutateAsyncRe({
                                permissions,
                                previous: data,
                            })
                            reset()

                        }} disabled={isPending || isPendingRe || isPendingVoice || isRecording} className="px-3" size={"icon"}>
                            {isPendingRe ? <Loader className="animate-spin" /> : <Redo />}
                        </Button>
                        <Button type="button" onClick={async () => {
                            if (isRecording) {
                                stop()
                                // await transcribeRecordings()
                            }
                            else {
                                updateRecords([])
                                start()
                            }
                        }} disabled={isPending || isPendingRe || isPendingVoice} className="px-3" size={"icon"}>
                            {isRecording ? <Pause /> :
                                isPendingVoice ? <Loader className="animate-spin" /> :
                                    <Mic />}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default Platform;