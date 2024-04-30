"use client"

import type { Session } from "next-auth";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/components/ui/avatar"
import { Input } from "../ui/input";
import { useEffect } from "react";
import { StateManagement, permissionDrawerState } from "~/lib/state";

const User = ({session}:{session: Session}) => {
    const { user } = session
    const {login} = StateManagement(s => ({login:s.login}))
    const [setOpen] = permissionDrawerState(e => [ e.setState])

    useEffect(() => {
        login(user)
    }, [user, login])
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome {user.name}</CardTitle>
                <CardDescription>
                    {user.email}
                </CardDescription>
                <CardDescription>
                    {user?.number}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-row gap-2 w-full">
                    <Avatar>
                        <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p>{user.name}</p>
                        <p>{user?.number}</p>
                    </div>
                    <Button className="ms-auto" asChild>
                    <Link href={"/api/auth/signout"}>
                        Sign Out
                    </Link>
                </Button>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => setOpen(true)} variant="outline">Edit Permission</Button>
            </CardFooter>
        </Card>
    );
}

export default User;