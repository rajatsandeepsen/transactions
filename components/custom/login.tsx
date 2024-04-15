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
const Login = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Make to login here to continue.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Button variant={"secondary"} className="w-full">
                        Login with Google
                    </Button>
                </div>
                <div className="space-y-1">
                    <Button className="w-full" asChild>
                        <Link href={"/api/auth/signin"}>
                            Login with Github
                        </Link>
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                {/* <Button>Save changes</Button> */}
            </CardFooter>
        </Card>
    );
}

export default Login;