import {Bars3Icon} from "@heroicons/react/24/outline";


export default function MainHeader({ onToggleSidebar }: {onToggleSidebar?: () => void }) {

	return (
		<header className="sticky top-0 z-40 bg-white border-b border-emerald-100">
			<div className="h-15 px-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
						aria-label="Открыть меню"
						onClick={onToggleSidebar}
					>
                        <Bars3Icon className="w-5 h-5" />
                    </button>
				</div>

				<div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <span className="lg:text-2xl md:text-xl sm:text-xl font-semibold text-emerald-800">
                            TrainingSpace
                        </span>
                    </div>
				</div>
			</div>
		</header>
	);
}