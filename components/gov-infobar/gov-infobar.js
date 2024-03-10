/**
 * @file
 * JS for hidding the Infobars.
 */
(function infobar(Drupal, once) {
  Drupal.behaviors.infobar = {
    attach(context) {

      const infobars = once('js-gov-infobar', '.gov-infobar', context);

      if (!infobars.length > 0) {
        return;
      }

      infobars.forEach((infobar) => {
        var infobarId = infobar.dataset.infobarId;

        let infobarCloseButton = infobar.querySelector('.gov-infobar__close');
        if (!infobarCloseButton) {
          return;
        }
        var infobarCloseTime = infobarCloseButton.dataset.infobarCloseFor;
        var nowTimestamp = new Date().getTime();

        // Hide the infobar and set local storage.
        function infobarClose() {
          // Hide the infobar.
          infobar.classList.add('visually-hidden');
          // Prepare the current timestamp.
          var infobarLS = { timestamp: nowTimestamp }
          localStorage.setItem(infobarId, JSON.stringify(infobarLS));
        };

        // Hide the infobar if it is set in localStorage.
        function infobarHide() {
          infobar.classList.add('visually-hidden');
        };

        // Remove the infobar from Local storage if it is too old.
        function infobarRemove() {
          localStorage.removeItem(infobarId);
        };

        // Read the stored value from local storage.
        var readInfobarLS = JSON.parse(localStorage.getItem(infobarId));
        if (readInfobarLS) {
          var dateString = readInfobarLS.timestamp;
        }

        // If current time is smaller then the stored time we hide the infobar.
        if (nowTimestamp < (dateString + (3600 * infobarCloseTime))) {
          infobarHide();
        }
        // If not, we remove the local storage entry.
        else {
          infobarRemove();
        }

        // Add event listeners.
        infobarCloseButton.addEventListener('click', infobarClose);

      });
    }
  };

})(Drupal, once);
