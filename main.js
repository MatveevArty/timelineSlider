import { TimelineSlider } from './timeline-component/timeline-slider.js';

class DatesInterface {
    constructor() {
        this.minDateInput = document.getElementById('min-date-input');
        this.maxDateInput = document.getElementById('max-date-input');
        this.startDateInput = document.getElementById('start-date-input');
        this.endDateInput = document.getElementById('end-date-input');
        this.dateInputs = [this.minDateInput, this.maxDateInput, this.startDateInput, this.endDateInput];
        this.timelineSliderInstance = null;

        this.updateSlider = this.updateSlider.bind(this); // Фиксация контекста
        this.applyDateMask = this.applyDateMask.bind(this);

        this.init();
    }

    init() {
        this.applyDateMasks();
        this.setupEventListeners();
        this.setDefaultValues();
        this.updateSlider();
    }

    applyDateMask(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) {
            value = value.substring(0, 4) + '-' + value.substring(4);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + '-' + value.substring(7);
        }
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        e.target.value = value;
    }

    applyDateMasks() {
        this.dateInputs.forEach(input => input.addEventListener('input', this.applyDateMask));
    }

    setupEventListeners() {
        this.dateInputs.forEach(input => input.addEventListener('change', this.updateSlider));
    }

    setDefaultValues() {
        this.minDateInput.value = '2014-01-01';
        this.maxDateInput.value = '2021-01-01';
        this.startDateInput.value = '2015-05-01';
        this.endDateInput.value = '2017-09-01';
    }

    dateConvert(date) {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }

    updateSlider() {
        this.timelineSliderInstance = new TimelineSlider({
            minDate: this.minDateInput.value,
            maxDate: this.maxDateInput.value,
            startDate: this.startDateInput.value,
            endDate: this.endDateInput.value,
            containerId: 'my-timeline',
        });
        // Переназначение дат в случае ошибок интервалов
        this.minDateInput.value = this.dateConvert(this.timelineSliderInstance.minDate);
        this.maxDateInput.value = this.dateConvert(this.timelineSliderInstance.maxDate);
        this.startDateInput.value = this.dateConvert(this.timelineSliderInstance.startDate);
        this.endDateInput.value = this.dateConvert(this.timelineSliderInstance.endDate);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new DatesInterface();
});