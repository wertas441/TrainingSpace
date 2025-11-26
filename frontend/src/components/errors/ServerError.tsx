
export default function ServerError({ message }: {message: string | null}) {

    if (!message) {
        return null;
    }

    return (
        <div
            className={`p-3 my-2 text-sm text-red-700 bg-red-100 rounded-lg`}
            role="alert"
        >
            <p>{message}</p>
        </div>
    );
}