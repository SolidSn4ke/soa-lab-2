
export function getVisiblePages(
    currentPage: number,
    totalPages: number
): number[] {
    const windowSize = 5;

    if (totalPages <= windowSize) {
        return Array.from(
            { length: totalPages },
            (_, index) => index
        );
    }

    let start = currentPage - 2;
    let end = currentPage + 2;

    if (start < 0) {
        start = 0;
        end = windowSize - 1;
    }

    if (end >= totalPages) {
        end = totalPages - 1;
        start = totalPages - windowSize;
    }

    return Array.from(
        { length: end - start + 1 },
        (_, index) => start + index
    );
}
