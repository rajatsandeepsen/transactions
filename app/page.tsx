
import { getServerAuthSession } from "~/server/auth";

import Login from "~/components/custom/login";
import Platform from "~/components/custom/platform";
import User from "~/components/custom/user";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import { DrawerDialogDemo } from "~/components/custom/permission";

export default async function Home() {
  const session = await getServerAuthSession()
  return (
    <>
      <DrawerDialogDemo />
      <Tabs defaultValue="login" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Profile</TabsTrigger>
          <TabsTrigger disabled={!session?.user} value="welcome">Welcome</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          {session?.user ? <User session={session} /> : <Login />}
        </TabsContent>
        <TabsContent value="welcome">
          <Platform />
        </TabsContent>
      </Tabs>
    </>
  )
}
