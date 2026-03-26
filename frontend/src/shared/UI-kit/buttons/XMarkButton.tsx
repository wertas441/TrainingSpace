import {XMarkIcon} from "@heroicons/react/24/outline";

export default function XMarkButton({onClick}: {onClick: () => void}) {

    return (
        <button
            onClick={onClick}
            className="rounded-md cursor-pointer p-2 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-neutral-700  dark:text-emerald-500"
        >
            <XMarkIcon className="h-6 w-6" />
        </button>
    )
}