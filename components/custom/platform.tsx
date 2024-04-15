"use client"

import { ArrowRight } from "lucide-react"
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

const Platform = () => {
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to AI Era</CardTitle>
                <CardDescription>
                    Ai enabled banking system.
                </CardDescription>
            </CardHeader>

            
            {/* <CardContent className="space-y-2">
            <div className="space-y-1">
            <Label htmlFor="new">New welcome</Label>
            <Input id="new" type="welcome" />
            </div>
        </CardContent> */}
            <CardFooter>
                <div className="flex gap-2 w-full">
                    <Input id="current" type="welcome" className="rounded-full"/>
                    <Button className="px-3" size={"icon"}><ArrowRight /></Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default Platform;

//         {data && data.((item) => (
//           <CardContent>
//             {JSON.stringify(item)}
//           </CardContent>
//         ))}
//         <CardFooter>
//           <form onSubmit={(e) => {
//             e.preventDefault()
//             sentPrompt({
//               prompt: "createTransaction",
//             })
//           }}>
//           <Input />
//           </form>
//         </CardFooter>