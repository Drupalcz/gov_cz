class FocusTrap {
  constructor(content, triggerButton, settings = {}) {
    this._content = content;
    this._triggerButton = triggerButton;
    this._settings = Object.assign({
      isOpenFunction: () => false, // Default to a function returning false
      bodyDataAttribute: 'data-focus-trap-enabled',
    }, settings);

    this._focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.boundHandleKeyDown = this._handleKeyDown.bind(this); // Bind for add/removeEventListener

  }

  activate() {
    if (typeof this._settings.isOpenFunction === 'function' && this._settings.isOpenFunction()) {
      window.addEventListener('keydown', this.boundHandleKeyDown);
      document.body.setAttribute(this._settings.bodyDataAttribute, 'true');
    }
  }

  deactivate() {
    window.removeEventListener('keydown', this.boundHandleKeyDown);
    document.body.removeAttribute(this._settings.bodyDataAttribute);
  }

  _handleKeyDown(e) {
    // No need to check isOpenFunction here since activation/deactivation manages this
    const focusableNodes = this._getFocusableNodes();
    const firstFocusableElement = focusableNodes[0];
    const lastFocusableElement = focusableNodes[focusableNodes.length - 1];
    const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    const isEscapePressed = e.key === 'Escape' || e.keyCode === 27;

    if (isEscapePressed) {
      this.deactivate(); // This will remove the data attribute and deactivate the focus trap
      return; // Exit the function early
    }

    if (!isTabPressed) return;

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else { // Tab
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }

  _getFocusableNodes() {
    // Get all focusable elements within the content
    const nodes = Array.from(this._content.querySelectorAll(this._focusableElements));

    // Check if the trigger button should be included in the focusable nodes
    if (this._triggerButton && !this._content.contains(this._triggerButton)) {
      // Add the trigger button to the start or end of the list, depending on your needs
      nodes.unshift(this._triggerButton); // Adds to the beginning if you want it to be the first focusable element
      // Or, use push to add it to the end: nodes.push(this._triggerButton);
    }

    return nodes.filter(node => !node.hasAttribute('disabled') && node.getAttribute('tabindex') !== '-1');
  }
}
