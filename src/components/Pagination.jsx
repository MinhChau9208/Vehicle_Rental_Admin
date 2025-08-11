import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '../assets/icon';

/**
 * @param {object} props - The component props.
 * @param {number} props.currentPage - The current active page.
 * @param {number} props.totalPages - The total number of pages.
 * @param {function} props.onPageChange - The function to call when the page changes.
 * @returns {JSX.Element|null} The rendered pagination component or null if there's only one page.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-end space-x-2 mt-4 text-sm text-gray-600">
            {/* Button to go to the first page */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="First page"
            >
                <React.Suspense fallback={<div className="w-4 h-4" />}>
                    <ChevronsLeft size={16} />
                </React.Suspense>
            </button>
            {/* Button to go to the previous page */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
            >
                <React.Suspense fallback={<div className="w-4 h-4" />}>
                    <ChevronLeft size={16} />
                </React.Suspense>
            </button>

            {/* Page number display */}
            <span className="font-medium text-gray-800">
                Page {currentPage} of {totalPages}
            </span>

            {/* Button to go to the next page */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
            >
                <React.Suspense fallback={<div className="w-4 h-4" />}>
                    <ChevronRight size={16} />
                </React.Suspense>
            </button>
            {/* Button to go to the last page */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Last page"
            >
                <React.Suspense fallback={<div className="w-4 h-4" />}>
                    <ChevronsRight size={16} />
                </React.Suspense>
            </button>
        </div>
    );
};

export default Pagination;
