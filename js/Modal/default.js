import GovModal from './GovModal';

/**
 * @return {void}
 */
export function initModals() {
    const modalTriggers = document.querySelectorAll('.gov-modal__trigger');
    modalTriggers.forEach((modalTrigger) => new GovModal(modalTrigger));
}
