import {Bars3Icon, MoonIcon, SunIcon} from "@heroicons/react/24/outline";
import {useTheme} from "@/lib/utils/ThemeProvider";
import {firstDarkColorTheme} from "@/styles";

export default function MainHeader({ onToggleSidebar }: {onToggleSidebar?: () => void }) {

    const {theme, toggleTheme} = useTheme();

	return (
		<header className={`${firstDarkColorTheme} sticky top-0 z-40 border-b border-emerald-100 px-2`}>
			<div className="h-15 px-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="lg:hidden border border-emerald-300 inline-flex items-center justify-center p-1 rounded-md dark:border-neutral-700"
						aria-label="Открыть меню"
						onClick={onToggleSidebar}
					>
                        <Bars3Icon className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />
                    </button>
				</div>

				<div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <span className="lg:text-2xl md:text-2xl text-xl font-semibold text-emerald-800 dark:text-white">
                            TrainingSpace
                        </span>
                        <button onClick={toggleTheme} className={`cursor-pointer`}>
                            {theme === 'dark' ? (
                                <SunIcon className={`w-8 h-8 text-emerald-400 border border-neutral-700 rounded-md p-1`} />
                            ) : (
                                <MoonIcon className={`w-8 h-8 text-emerald-700 border border-emerald-300 rounded-md p-1`} />
                            )}
                        </button>
                    </div>
				</div>
			</div>
		</header>
	);
}