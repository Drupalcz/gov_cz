import GovCalendar from './GovCalendar';

/**
 * @return {void}
 */
export function initCalendar() {
    const calendars = document.querySelectorAll('.gov-js-calendar');
    calendars.forEach((calendar) => new GovCalendar(calendar));
}
