import GovSliderBar from './GovSliderBar';

/**
 * @return {void}
 */
export function initGovSliderBars() {
    const sliderBars = document.querySelectorAll('.gov-slider-bar');
    sliderBars.forEach((sliderBar) => new GovSliderBar(sliderBar));
}
