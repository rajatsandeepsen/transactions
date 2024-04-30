"use client"

import { ArrowRight, Loader, Redo } from "lucide-react"
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
import {Actions} from "~/components/actions"
import { TimeLine } from "../actions/timeline"
import { StateManagement } from "~/lib/state"

type FormEvent<T extends string> = React.FormEvent<HTMLFormElement> & {
    target: {
        [key in T]: { value: string }
    }
}

const Platform = () => {
    const { data, mutateAsync, isPending, reset } = api.execute.initiative.useMutation()
    const { data:dataRe, mutateAsync:mutateAsyncRe, isPending:isPendingRe } = api.execute.reInitative.useMutation()
    const [permissions, state] =  StateManagement(e => ([e.permissions, e.userState]))
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to AI Era</CardTitle>
                <CardDescription>
                    Ai enabled banking system.
                </CardDescription>
            </CardHeader>
            {/* <CardContent>
                {data && JSON.stringify(data, null, 2)}
            </CardContent> */}

            {(data ? data : dataRe)?.executions.map((item) => {
                const key = item.key === "unknown" ? "unavailableAction" : item.key as keyof typeof Actions 
                const Component = Actions[key]
                return (
                    <CardContent className="flex flex-row gap-2 py-0">
                        <TimeLine i={item.iteration} error={item.error} />
                        {item && <Component data={item as unknown as typeof Component["arguments"]["data"]} />}
                    </CardContent>
                )
            }
            )}
            <CardFooter className="mt-3">
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
                        <Input name="prompt" id="current" type="text" className="rounded-full flex-1" />
                        <Button type="submit" disabled={isPending || isPendingRe} className="px-3" size={"icon"}>
                            {isPending ? <Loader className="animate-spin"/> :<ArrowRight />}
                        </Button>
                        <Button type="button" onClick={async() => {
                            await mutateAsyncRe({
                                permissions,
                                previous: data,
                            })
                            reset()

                        }} disabled={isPending || isPendingRe} className="px-3" size={"icon"}>
                            {isPendingRe ? <Loader className="animate-spin"/> :<Redo />}
                        </Button>
                    </div>
                </form>
            </CardFooter>
        </Card>
    );
}

export default Platform;