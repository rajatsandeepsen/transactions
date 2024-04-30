import { Check, CheckCircle, X } from "lucide-react";

export const TimeLine = ({ error, i }: { error?: Error | unknown, i:number }) => {
    return (
        <div className="w-10 relative">
            <div className={`w-1 absolute h-full ${!error ? "bg-green-500" : "bg-red-500"} left-1/2 transform -translate-x-1/2`} />
            <div className={`w-10 h-10 ${!error ? "bg-green-500" : "bg-red-500"} absolute top-9 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full`}>
                <div className="flex flex-col justify-center items-center h-full text-white">
                    {!error ? <CheckCircle/> : <X/>}
                </div>
            </div>
        </div>
    );
}