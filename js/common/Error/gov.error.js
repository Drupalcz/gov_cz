export default class GovError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GovWidgetError';
    }
}
