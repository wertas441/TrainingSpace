import {secondDarkColorTheme} from "@/lib";


export default function NullElementsError({text}:{text: string}) {

    return (
        <div className={`${secondDarkColorTheme} w-full border text-black border-emerald-100 rounded-lg p-6 text-center text-sm dark:text-white`}>
            {text}
        </div>
    )
}