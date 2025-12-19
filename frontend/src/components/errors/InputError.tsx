
export default function InputError({error}:{error: string | null}){

    return (
        <div className="error">
            {error  && (
                <p className="pt-2 pl-1 text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
        </div>
    )
}