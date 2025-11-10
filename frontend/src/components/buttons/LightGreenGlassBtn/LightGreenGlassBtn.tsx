
interface LightGreenGlassBtnProps{
    label: string;
    onClick: () => void;
    className?: string;
}

export default function LightGreenGlassBtn({label, onClick, className = ''}: LightGreenGlassBtnProps ) {

    return (
        <button
            onClick={onClick}
            className={`px-4 w-full cursor-pointer py-2 text-sm rounded-md border 
                border-emerald-200 text-emerald-700 hover:bg-emerald-50 ${className}`}
        >
            {label}
        </button>
    )
}