import {secondDarkColorTheme} from "@/lib";


export default function NullElementsError({text}:{text: string}) {

    return (
        <div className={`${secondDarkColorTheme} w-full rounded-lg p-6 text-center text-sm text-white`}>
            {text}
        </div>
    )
}