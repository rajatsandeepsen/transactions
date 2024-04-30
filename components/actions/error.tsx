import { CardDescription, CardHeader, CardTitle } from "../ui/card";

const ErrorComponent = ({ error }: { error: Error }) => {
    return (
        <div>
            <CardHeader className="px-7">
                <CardTitle>{error.message}</CardTitle>
                <CardDescription>
                    {error.name}
                </CardDescription>
            </CardHeader>
        </div>
    );
}

export default ErrorComponent;