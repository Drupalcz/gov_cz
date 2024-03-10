class ToggleSection {
  constructor(button, content, settings = {}) {
    this._button = button;
    this._content = content;
    // Apply default settings and override them with any user-provided settings
    this._settings = Object.assign({
      enableDocumentClick: true,
      applyHiddenAttribute: false,
    }, settings);

    this._button.addEventListener('click', this._handleButtonClick.bind(this));

    if (this._settings.enableDocumentClick) {
      document.addEventListener('click', this._handleDocumentClick.bind(this), true);
    }

    document.addEventListener('keydown', this._handleEscapePress.bind(this));
  }

  expand() {
    this._button.setAttribute('aria-expanded', 'true');
    this._content.setAttribute('data-toggle-section-expanded', 'true');
    this._content.setAttribute('aria-hidden', 'false');
    if (this._settings.applyHiddenAttribute) {
      this._content.removeAttribute('hidden');
    }
  }

  collapse(focus = false) {
    this._button.setAttribute('aria-expanded', 'false');
    this._content.setAttribute('data-toggle-section-expanded', 'false');
    this._content.setAttribute('aria-hidden', 'true');
    if (this._settings.applyHiddenAttribute) {
      this._content.setAttribute('hidden', '');
    }
    if (focus) {
      this._button.focus();
    }
  }

  toggle() {
    if (this._button.getAttribute('aria-expanded') === 'true') {
      this.collapse();
    } else {
      this.expand();
    }
  }

  _handleButtonClick() {
    this.toggle();
  }

  _handleDocumentClick(e) {
    if (!this._content.contains(e.target) && !this._button.contains(e.target) && e.type === 'click') {
      this.collapse();
    }
  }

  _handleEscapePress(e) {
    const hasFocus = this._content.contains(document.activeElement) || this._button === document.activeElement;
    if ((e.key === 'Escape' || e.keyCode === 27) && hasFocus) {
      this.collapse();
    }
  }

}
