import { Badge } from "~/components/ui/badge"
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
import type { AFC } from "~/lib/schema";
import { Progress } from "~/components/ui/progress"
import { Button } from "../ui/button";
import { StateManagement, permissionDrawerState } from "~/lib/state";

const calculateMaths: AFC<"calculateMaths"> = ({ data }) => {
    const { result, error, value } = data

    return (
        <div>
            <CardHeader className="px-7">
                <CardTitle>Result of {value.operation} {value.value && `with ${value.value}`}</CardTitle>
                <CardTitle className="text-4xl">${result?.amount}</CardTitle>
                <CardDescription>
                    {error?.message}
                </CardDescription>
                <GetPermission message={error?.message} />
            </CardHeader>
        </div>
    )
}

const GetPermission = ({ message }: { message?: string }) => {
    const [open, setOpen] = permissionDrawerState(e => [e.state, e.setState])
    return (
        <CardContent className="px-0">
            {message?.includes("permitted") && <Button onClick={() => setOpen(true)}>Approve Permission</Button>}
        </CardContent>
    );
}

export default GetPermission;


const getBalance: AFC<"getBalance"> = ({ data }) => {
    const { result, error } = data
    return (
        <div>
            <CardHeader className="px-7">
                <CardTitle>Get Balance</CardTitle>
                <CardDescription>
                    {error?.message}
                </CardDescription>
                <GetPermission message={error?.message} />
                {result && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Balance</CardDescription>
                            <CardTitle className="text-4xl">${result?.amount ?? 0}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                +10% from last month
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress value={12} aria-label="12% increase" />
                        </CardFooter>
                    </Card>
                )}
            </CardHeader>
        </div>
    )
}
const changeUsersDetails: AFC<"changeUsersDetails"> = ({ data }) => {
    const { result, error } = data
    return (
        <div>
            <CardHeader className="px-7">
                <CardTitle>Change User Data</CardTitle>
                <CardDescription>
                    {error ? error.message : result?.message}
                </CardDescription>
                <GetPermission message={error?.message} />
            </CardHeader>
        </div>
    )
}


const unavailableAction: AFC<"unavailableAction"> = ({ data }) => {
    const { result, error } = data
    return (
        <div>
            <CardHeader className="px-7">
                <CardTitle>Unavailable Action</CardTitle>
                <CardDescription>
                    {result?.message} {error?.message}
                </CardDescription>
                <GetPermission message={error?.message} />
            </CardHeader>
        </div>
    );
}
const createTransaction: AFC<"createTransaction"> = ({ data }) => {
    const { result, value, error } = data
    return (
        <div>
            <CardHeader className="px-7">
                <CardTitle>Create Transaction</CardTitle>
                <CardDescription>
                    {error ? error.message : result?.message}
                </CardDescription>
                <CardDescription>
                    Sent ${value.amount} to {value.name} with number: {value.number}
                </CardDescription>
                <GetPermission message={error?.message} />
            </CardHeader>
        </div>
    );
}
const getTransactions: AFC<"getTransactions"> = ({ data }) => {
    const { result, error } = data
    if (!result || !result.transactions || result?.transactions?.length === 0 || error) return (<div>
        <CardHeader className="px-7">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>{error ? error.message : "Found no recent transactions from your account"}</CardDescription>
            <GetPermission message={error?.message} />
        </CardHeader>
    </div>
    )
    return (
        <div>
            <CardHeader className="px-7">
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent transactions from your account</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>-</TableHead>
                            <TableHead className="hidden sm:table-cell">From</TableHead>
                            <TableHead className="hidden sm:table-cell">To</TableHead>
                            <TableHead className="hidden sm:table-cell">Remark</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    {/* {JSON.stringify(result)} */}
                    <TableBody>
                        {result.transactions.map((transaction) => (
                            <TableRow className="bg-accent">
                                <TableCell>
                                    <div className="font-medium">{transaction.name}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{transaction.fromNumber}</TableCell>
                                <TableCell className="hidden sm:table-cell">{transaction.toNumber}</TableCell>
                                <TableCell className="hidden sm:table-cell">{transaction.remark}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        {transaction.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{transaction.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">${transaction.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </div>

    );
}
export const Actions = {
    createTransaction,
    getTransactions,
    unavailableAction,
    changeUsersDetails,
    getBalance,
    calculateMaths,

}