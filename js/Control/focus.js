export function govRemoveClickFocus() {
    const focusableElements = document.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')
    focusableElements.forEach((element) => {
        let mouseDown = false;
        element.addEventListener('mousedown', () => mouseDown = true);
        element.addEventListener('mouseup', () => mouseDown = false);
        element.addEventListener('focus', (event) => {
            if (mouseDown) {
                event.target.blur();
            }
        });
    })
}

govRemoveClickFocus()
window.govRemoveClickFocus = govRemoveClickFocus
