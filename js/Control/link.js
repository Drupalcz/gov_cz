export function govLinkAriaLabel() {
    const linkElements = document.querySelectorAll('a:not(.ignore-aria-label)')
    linkElements.forEach((element) => {
        const href = element.getAttribute('href');
        const ariaLabel = element.getAttribute('aria-label');
        const location = window.location
        const url = new URL(href, location.origin)
        const external = location.host !== url.host
        const content = element.textContent || element.title
        const externalMessage = external ? `| externí odkaz na ${url.host}` : ''

        if (ariaLabel && ariaLabel.length) return

        element.removeAttribute('title');
        element.setAttribute('aria-label', `${content} ${externalMessage}`)
    })
}

govLinkAriaLabel()
window.govLinkAriaLabel = govLinkAriaLabel
