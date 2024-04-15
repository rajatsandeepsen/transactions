import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import Platform from "~/components/custom/platform";
import Login from "~/components/custom/login";

export default async function Home() {
  const session = await getServerAuthSession()
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Profile</TabsTrigger>
        <TabsTrigger disabled={!session?.user} value="welcome">Welcome</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        {session?.user ? <>{JSON.stringify(session.user, null, 2)}</> :<Login/>}
      </TabsContent>
      <TabsContent value="welcome">
        <Platform/>
      </TabsContent>
    </Tabs>
  )
}
