import RedGlassBtn from "@/components/buttons/RedGlassButton/RedGlassBtn";
import LightGreenGlassBtn from "@/components/buttons/LightGreenGlassBtn/LightGreenGlassBtn";
import {memo, Ref} from "react";
import {secondDarkColorTheme} from "@/lib";

interface ModalWindowProps {
    isExiting: boolean;
    modalRef: Ref<HTMLDivElement | null>;
    windowLabel: string;
    windowText: string;
    error?: string | null;
    cancelButtonLabel: string;
    cancelFunction: () => void;
    confirmButtonLabel: string;
    confirmFunction: () => void;
    isProcess: boolean;
    isRendered: boolean;

}

function ModalWindow(
    {
        isExiting,
        modalRef,
        windowLabel,
        windowText,
        error,
        cancelButtonLabel,
        cancelFunction,
        confirmButtonLabel,
        confirmFunction,
        isProcess,
        isRendered,
    }: ModalWindowProps) {

    if (!isRendered) {
        return null;
    }

    return (
        <div className={`fixed inset-0 z-50 p-4 flex items-center justify-center ${isExiting ? 'plx-modal-exit' : 'plx-modal-enter'}`}>
            <div className="plx-modal-overlay absolute inset-0 bg-gray-900/85" />
            <div
                ref={modalRef}
                className={`${secondDarkColorTheme} plx-modal-dialog relative z-10  rounded-lg border border-gray-300 shadow-xl p-6 w-full max-w-2xl`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <h3 id="delete-modal-title" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    {windowLabel}
                </h3>
                <div className="mt-3">
                    <p id="delete-modal-description" className="text-sm text-gray-600 dark:text-gray-400">
                        {windowText}
                    </p>
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 border-l-4 border-red-400 text-sm text-red-800 p-3 rounded-md" role="alert">
                        <p><strong className="font-semibold">Ошибка:</strong> {error}</p>
                    </div>
                )}

                <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                    <LightGreenGlassBtn
                        label={cancelButtonLabel}
                        disabled={isProcess}
                        onClick={cancelFunction}
                    />

                    <RedGlassBtn
                        label={confirmButtonLabel}
                        onClick={confirmFunction}
                        disabled={isProcess}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(ModalWindow);