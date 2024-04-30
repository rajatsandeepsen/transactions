"use client"

import type * as React from "react"

import { cn } from "~/lib/utils"
import { useMediaQuery } from "~/hooks/use-media-query"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "~/components/ui/toggle-group"
import { Switch } from "~/components/ui/switch"

import { StateManagement, permissionDrawerState } from "~/lib/state"

export function DrawerDialogDemo() {
    const [open, setOpen] = permissionDrawerState(e => [e.state, e.setState])
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit permission</DialogTitle>
                        <DialogDescription>
                            Make changes to your permission here.
                        </DialogDescription>
                    </DialogHeader>
                    <PermissionForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit permission</DrawerTitle>
                    <DrawerDescription>
                        Make changes to your permission here.
                    </DrawerDescription>
                </DrawerHeader>
                <PermissionForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function PermissionForm({ className }: React.ComponentProps<"form">) {
    const [permission, setPermissions] = StateManagement(s => ([s.permissions, s.updatepermissions]))
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-full">Actions</TableHead>
                    <TableHead className="">Boolean</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.entries(permission).map(([key, value], index) => (
                    (<TableRow>
                        <TableCell className="font-semibold">{key}</TableCell>
                        <TableCell>
                        <Switch 
                        checked={value}
                        onCheckedChange={() => setPermissions(key as keyof typeof permission, !value)}
                        />
                        </TableCell>
                    </TableRow>)))}
            </TableBody>
        </Table>
    )
}