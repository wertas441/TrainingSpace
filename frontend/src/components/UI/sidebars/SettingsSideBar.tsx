import Link from "next/link";
import {
    ArrowLeftOnRectangleIcon,
    BookOpenIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import {SettingsMenuItemsStructure} from "@/types/indexTypes";
import {logout} from "@/lib/controllers/settingController";
import {usePageUtils} from "@/lib/hooks/usePageUtils";
import ModalWindow from "@/components/UI/other/ModalWindow";
import {useModalWindow} from "@/lib/hooks/useModalWindow";

const settingsMenuItems: SettingsMenuItemsStructure[] = [
    { id: 'profile', link: '/settings/profile',  label: 'Профиль', icon: UserCircleIcon },
    { id: 'password', link: '/settings/change-password', label: 'Сменить пароль', icon: LockClosedIcon },
    { id: 'email', link: '/settings/change-email', label: 'Сменить почту', icon: EnvelopeIcon },
    { id: 'projectInformation', link: '/settings/information', label: 'Информация о проекте', icon: BookOpenIcon },
] as const;

export default function SettingsSideBar({pathname}: {pathname: string}) {

    const {router} = usePageUtils();
    const {isRendered, isProcess, isExiting, toggleModalWindow, windowModalRef} = useModalWindow()

    const logOutButton = () => {
        logout();
        router.replace("/login");
    }

    return (
        <>
            <aside className="w-full lg:w-90">
                <nav className="space-y-2 p-3 rounded-lg border border-emerald-100 bg-white shadow-sm">
                    {settingsMenuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={item.link}
                                className={`w-full flex items-center gap-3 py-2.5 cursor-pointer px-3 rounded-md border transition text-left ${
                                    pathname === item.link
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                                        : 'bg-white text-emerald-700 border-white hover:bg-emerald-50'
                                }`}
                            >
                                <IconComponent className="h-5 w-5"/>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                    <div className="border-t border-emerald-100 my-2"></div>
                    <button
                        className={`w-full flex items-center cursor-pointer gap-3 py-2.5 px-3 rounded-md transition-colors
                        text-left text-red-700 bg-white hover:bg-red-50`}
                        onClick={toggleModalWindow}
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Выйти</span>
                    </button>
                </nav>
            </aside>

            <ModalWindow
                isExiting = {isExiting}
                modalRef = {windowModalRef}
                windowLabel = {'Подтверждение выхода'}
                windowText = {`Вы действительно хотите удалить выйти из своего пользовательского аккаунта? Это действие необратимо.`}
                cancelButtonLabel = {'Остаться'}
                cancelFunction = {toggleModalWindow}
                confirmButtonLabel = {'Выйти'}
                confirmFunction = {logOutButton}
                isProcess = {isProcess}
                isRendered = {isRendered}
            />
        </>
    )
}