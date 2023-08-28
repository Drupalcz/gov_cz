import GovSortableTable from './GovSortableTable';

/**
 * @return {void}
 */
export function initSortableTable() {
    const tables = document.querySelectorAll('.gov-js-sortable-table');
    tables.forEach((table) => new GovSortableTable(table));
}
