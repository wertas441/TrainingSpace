import Link from "next/link";
import {ComponentType, SVGProps} from "react";

interface SideBarElementProps {
	label: string;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
	link: string;
	className?: string;
	active: boolean;
}

export default function SideBarElement({ label, icon: Icon, link, className = '', active }: SideBarElementProps) {

	const baseItemClasses: string = 'group flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200';
	const activeClass: string = `${baseItemClasses} text-emerald-900 bg-emerald-50 ring-1 ring-inset ring-emerald-200`;
	const inActiveClass: string = `${baseItemClasses} text-gray-700 hover:text-emerald-900 hover:bg-emerald-50 hover:ring-1 hover:ring-inset hover:ring-emerald-200`;

	return (
		<li>
			<Link
				href={link}
				aria-current={active ? 'page' : undefined}
				className={`${active ? activeClass : inActiveClass} ${className}`}
			>
				{Icon && <Icon className="h-5 w-5 shrink-0 text-emerald-600 group-hover:text-emerald-700 transition-colors" />}
				<span className="truncate">{label}</span>
			</Link>
		</li>
	);
}