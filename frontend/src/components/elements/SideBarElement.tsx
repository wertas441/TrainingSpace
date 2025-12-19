import Link from "next/link";
import {ComponentType, memo, SVGProps} from "react";

interface SideBarElementProps {
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	link: string;
	className?: string;
	active: boolean;
    onClick: () => void;
}

function SideBarElement({ label, icon: Icon, link, className = '', active, onClick }: SideBarElementProps) {

	const baseItemClasses: string = 'group flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 dark:text-white';
	const activeClass: string = `${baseItemClasses} text-emerald-900 bg-emerald-50 ring-1 ring-inset ring-emerald-200 dark:ring-0 dark:text-white dark:bg-emerald-600`;
	const inActiveClass: string = `${baseItemClasses} text-gray-700 hover:text-emerald-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-600 hover:ring-1 dark:hover:ring-0 hover:ring-inset hover:ring-emerald-200`;

	return (
		<li>
			<Link
				href={link}
				aria-current={active ? 'page' : undefined}
				className={`${active ? activeClass : inActiveClass} ${className}`}
                onClick={onClick}
			>
				{Icon && <Icon className={`h-5 w-5 shrink-0 text-emerald-600 group-hover:text-emerald-700 dark:group-hover:text-white transition-colors ${active ? 'dark:text-white' : ''}`} />}
				<span className="truncate">{label}</span>
			</Link>
		</li>
	);
}

export default memo(SideBarElement);