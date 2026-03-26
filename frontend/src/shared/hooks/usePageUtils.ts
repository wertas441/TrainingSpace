import {useCallback, useState} from "react";
import {useRouter} from "next/navigation";

export function usePageUtils() {

    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const goToPage = useCallback((url: string) => {
        router.push(url);
    }, [router]);

    return {
        serverError,
        setServerError,
        isSubmitting,
        setIsSubmitting,
        router,
        goToPage
    }
}