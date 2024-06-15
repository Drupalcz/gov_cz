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
      const sourceCloseForeverString = 'forever';
      const localStorageCloseForeverString = 'do not display';

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
          infobar.hidden = true;
          // Prepare the current timestamp.
          if (infobarCloseTime == sourceCloseForeverString) {
            localStorage.setItem(infobarId, localStorageCloseForeverString);
          }
          else {
            var infobarLS = { timestamp: nowTimestamp }
            localStorage.setItem(infobarId, JSON.stringify(infobarLS));
          }
        };

        // Hide the infobar if it is set in localStorage.
        function infobarHide() {
          infobar.hidden = true;
        };

        // Remove the infobar from Local storage if it is too old.
        function infobarLSRemove() {
          localStorage.removeItem(infobarId);
        };

        // Read the stored value from local storage.
        var readInfobarLS = localStorage.getItem(infobarId);
        // If the value is 'forever', we hide the infobar.
        if (readInfobarLS && typeof readInfobarLS === 'string' && readInfobarLS == localStorageCloseForeverString) {
          infobarHide();
        }
        // If there is other value we process it and act accordingly.
        else if (readInfobarLS) {
          var dateString = JSON.parse(readInfobarLS).timestamp;

          // If current time is smaller then the stored time we hide the infobar.
          if (nowTimestamp < (dateString + (3600 * 1000 * infobarCloseTime))) {
            infobarHide();
          }
          // If not, we remove the local storage entry.
          else {
            infobarLSRemove();
          }
        }

        // Add event listeners.
        infobarCloseButton.addEventListener('click', infobarClose);

      });
    }
  };

})(Drupal, once);
