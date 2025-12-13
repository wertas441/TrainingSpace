import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import {memo} from "react";

interface MainPaginationProps{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    setCurrentPage: (value: number | ((prev: number) => number)) => void,
    itemsPerPage: number;
}

function MainPagination(
    {
        currentPage,
        totalPages,
        totalItems,
        setCurrentPage,
        itemsPerPage,
    }:MainPaginationProps){

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="hidden md:flex items-center gap-2">
                    <button
                        type="button"
                        className={`px-3 py-1.5 text-sm cursor-pointer rounded-md border ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ArrowLeftIcon className={'h-4 w-4'} />
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map(p => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`h-8 min-w-8 px-4 rounded-md cursor-pointer text-sm border ${p === currentPage ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                            >
                                {p}
                            </button>
                        ))}
                        {totalPages > 7 && (
                            <span className="px-1 text-sm text-gray-500">…</span>
                        )}
                    </div>
                    <button
                        type="button"
                        className={`px-3 py-1.5 text-sm  cursor-pointer rounded-md border ${currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ArrowRightIcon className={'h-4 w-4'} />
                    </button>
                </div>

                <div className="hidden md:flex text-xs text-gray-600">
                    Показано {Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
                </div>
            </div>

            <div className="md:hidden space-y-2">
                <div className="text-center text-xs text-gray-600">
                    Показано {Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
                </div>
                <div className="flex items-center py-3 justify-center gap-2">
                    <button
                        type="button"
                        className={`px-3 py-1.5 cursor-pointer text-sm rounded-md border ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ArrowLeftIcon className={'h-4 w-4'} />
                    </button>
                    <div className="px-3 py-1 bg-white rounded-md border border-emerald-600 text-sm text-emerald-800">
                        {currentPage} / {totalPages}
                    </div>
                    <button
                        type="button"
                        className={`px-3 py-1.5 cursor-pointer text-sm rounded-md border ${currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ArrowRightIcon className={'h-4 w-4'} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default memo(MainPagination);