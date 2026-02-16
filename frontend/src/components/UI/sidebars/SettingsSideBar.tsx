import Link from "next/link";
import {
    ArrowLeftOnRectangleIcon,
    BookOpenIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import {SettingsMenuItemsStructure} from "@/types";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";
import {secondDarkColorTheme} from "@/styles";
import {makeLogout, useUserStore} from "@/lib/store/userStore";

const settingsMenuItems: SettingsMenuItemsStructure[] = [
    { id: 'profile', link: '/settings/profile',  label: 'Профиль', icon: UserCircleIcon },
    { id: 'password', link: '/settings/change-password', label: 'Сменить пароль', icon: LockClosedIcon },
    { id: 'email', link: '/settings/change-email', label: 'Сменить почту', icon: EnvelopeIcon },
    { id: 'projectInformation', link: '/settings/information', label: 'Информация о проекте', icon: BookOpenIcon },
] as const;

export default function SettingsSideBar({pathname}: {pathname: string}) {

    const {router} = usePageUtils();
    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()
    const logout = useUserStore(makeLogout);

    const logOutButton = async () => {
        await logout();
        router.replace("/auth/login");
    }

    return (
        <>
            <aside className={`w-full lg:w-90`}>
                <nav className={`${secondDarkColorTheme} space-y-2 p-3 rounded-lg border border-emerald-100 shadow-sm`}>
                    {settingsMenuItems.map((item) => {
                        const active = pathname === item.link;
                        return (
                            <Link
                                key={item.id}
                                href={item.link}
                                className={`w-full flex items-center gap-3 py-2.5 cursor-pointer px-3 rounded-md border transition text-left ${
                                    active
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow '
                                        : 'text-emerald-700 border-white hover:bg-emerald-50 dark:hover:bg-neutral-800  dark:text-white dark:border-neutral-900'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 dark:group-hover:text-white ${!active ? 'text-emerald-600' : ''} `}/>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                    <div className="border-t border-emerald-100 dark:border-neutral-700 my-2"></div>
                    <button
                        className={`w-full flex items-center cursor-pointer gap-3 py-2.5 px-3 rounded-md transition-colors
                        text-left text-red-700  hover:bg-red-50 dark:hover:bg-neutral-800 dark:hover:border-red-500 dark:text-red-400`}
                        onClick={toggleModalWindow}
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Выйти</span>
                    </button>
                </nav>
            </aside>

            <ModalWindow
                isExiting={isExiting}
                modalRef={windowModalRef}
                windowLabel={'Подтверждение выхода'}
                windowText={`Вы действительно хотите удалить выйти из своего пользовательского аккаунта? Это действие необратимо.`}
                cancelButtonLabel={'Остаться'}
                cancelFunction={toggleModalWindow}
                confirmButtonLabel={'Выйти'}
                confirmFunction={logOutButton}
                isProcess={isProcess}
                isRendered={isRendered}
            />
        </>
    )
}