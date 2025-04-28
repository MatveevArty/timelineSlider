export class TimelineSlider {
    constructor(options) {
        this.sliderConstants(); // Настройка основных констант
        this.checkInputData(options); // Валидация пришедших данных
        if (this.container) {
            this.init(); // Основной движок
        }
    }

    sliderConstants() {
        this.defaultMinDate = new Date(2014, 0, 1); // Дефолтное значение для мин даты в случае ошибки
        this.defaultMaxDate = new Date(2021, 1, 1); // Дефолтное значение для макс даты в случае ошибки
        this.hasSelection = false; // Флаг интервала выбранных дат
        this.errorEndMsg1 = ' Отображается шкала в периоде по умолчанию';
        this.errorEndMsg2 = ' Интервал не выбран';
        this.errorStartMsg = 'Введённые даты начала/конца валидны';
        this.errorStartMsg2 = 'Введённые макс и мин даты валидны';
        this.maxYearsRange = 20;
        this.mode = 'years'; // По умолчанию отображаем года
        this.monthStep = 1; // По умолчанию показываем все месяцы
        this.shortMonthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        this.fullMonthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        // Настройки отображения месяцев
        this.monthDisplaySettings = {
            // Пороги для переключения режимов (в годах)
            byOneMonthMode: 3,            // Показывать все месяцы
            byTwoMonthsThreshold: 6,      // Показывать каждый 2-й месяц
            byThreeMonthsThreshold: 9,    // Показывать каждый 3-й месяц
            byFourMonthsThreshold: 12,    // Показывать каждый 4-й месяц
            bySixMonthsThreshold: 16,     // Показывать каждый 6-й месяц

            // Шаги для разных режимов
            oneMonthStep: 1,
            twoMonthsStep: 2,
            threeMonthsStep: 3,
            fourMonthsStep: 4,
            sixMonthsStep: 6,
            noMonthStep: 12,
        };
    }

    checkInputData(options) {
        this.checkContainer(options); // Валидация контейнера
        if (this.container) {
            this.checkMinMaxDates(options); // Валидация мин/макс дат
            this.checkStartEndDates(options); // Валидация выбранных дат начала и конца
        }
    }

    checkContainer(options) {
        // Проверка id для вставки слайдера
        if (options.containerId) {
            this.container = document.getElementById(options.containerId);
            if (!this.container) {
                alert('Неверный id для назначаемого блока вставки слайдера');
            }
        } else {
            alert('Не передан параметр containerId со значением id блока для вставки слайдера');
        }
    }

    checkMinMaxDates(options) {
        // Проверка валидности мин/макс дат и назначение дефолтных значений в случае ошибки
        const isMinDateValid = !!this.parseDate(options.minDate);
        const isMaxDateValid = !!this.parseDate(options.maxDate);
        if (!isMinDateValid || !isMaxDateValid) {
            if (!isMinDateValid && !isMaxDateValid) {
                alert('Ошибка в обоих мин/макс датах.' + this.errorEndMsg1);
            } else if (!isMinDateValid) {
                alert('Ошибка в мин дате.' + this.errorEndMsg1);
            } else if (!isMaxDateValid) {
                alert('Ошибка в макс дате.' + this.errorEndMsg1);
            }
            this.minMaxDatesToDefault();
        } else {
            // Проверка, что мин дата меньше макс даты
            if (!this.compareDates(new Date(options.minDate), new Date(options.maxDate))) {
                alert(this.errorStartMsg2 + ', но мин дата больше макс даты.' + this.errorEndMsg1)
                this.minMaxDatesToDefault();
            } else {
                // Проверка на большой диапазон
                const minMaxDatesYearDiff = new Date(options.maxDate).getFullYear() - new Date(options.minDate).getFullYear();
                if (minMaxDatesYearDiff > this.maxYearsRange) {
                    alert(this.errorStartMsg2 + ', но разница годов слишком большая (>20 лет). Макс дата взята переназначена на максимально возможную.');
                    this.minDate = new Date(options.minDate);
                    const newMaxDate = new Date(this.minDate);
                    newMaxDate.setFullYear(newMaxDate.getFullYear() + 20);
                    this.maxDate = newMaxDate;
                } else {
                    this.minDate = new Date(options.minDate);
                    this.maxDate = new Date(options.maxDate);
                }
            }
        }
    }

    checkStartEndDates(options) {
        // Проверка валидности выбранных первой и последней дат интервала
        const isStartDateValid = !!this.parseDate(options.startDate);
        const isEndDateValid = !!this.parseDate(options.endDate);
        if (!isStartDateValid || !isEndDateValid) {
            if (!isStartDateValid && !isEndDateValid) {
                alert('Ошибка в обоих выбранных датах начала/конца.' + this.errorEndMsg2);
            } else if (!isStartDateValid) {
                alert('Ошибка в дате начала.' + this.errorEndMsg2);
            } else if (!isEndDateValid) {
                alert('Ошибка в датах конца.' + this.errorEndMsg2);
            }
        } else {
            const isStartDateSmallerMin = this.compareDates(new Date(options.startDate), this.minDate);
            const isEndDateSmallerMin = this.compareDates(new Date(options.endDate), this.minDate);
            const isStartDateBiggerMax = this.compareDates(this.maxDate, new Date(options.startDate));
            const isEndDateBiggerMax = this.compareDates(this.maxDate, new Date(options.endDate));

            if (isStartDateSmallerMin || isEndDateSmallerMin || isStartDateBiggerMax || isEndDateBiggerMax) {
                if (isStartDateSmallerMin && isEndDateSmallerMin) {
                    alert(this.errorStartMsg + ', но даты начала и конца меньше мин даты.' + this.errorEndMsg2);
                } else if (isStartDateSmallerMin && !isEndDateSmallerMin && !isEndDateBiggerMax) {
                    alert(this.errorStartMsg + ', но дата начала меньше мин даты. Дата начала выбрана минимально возможная');
                    this.startDate = this.minDate;
                    this.endDate = new Date(options.endDate);
                    this.hasSelection = true;
                } else if (isEndDateSmallerMin) {
                    alert(this.errorStartMsg + ', но дата конца меньше мин даты и меньше даты начала.' + this.errorEndMsg2);
                } else if (isStartDateBiggerMax && isEndDateBiggerMax) {
                    alert(this.errorStartMsg + ', но больше макс даты.' + this.errorEndMsg2);
                } else if (isStartDateBiggerMax) {
                    alert(this.errorStartMsg + ', но дата начала больше макс даты и больше даты конца.' + this.errorEndMsg2);
                } else if (isEndDateBiggerMax && !isStartDateSmallerMin) {
                    alert(this.errorStartMsg + ', но дата конца больше макс даты. Дата конца выбрана максимально возможная');
                    this.startDate = new Date(options.startDate);
                    this.endDate = this.maxDate;
                    this.hasSelection = true;
                } else if (isStartDateSmallerMin && isEndDateBiggerMax) {
                    alert(this.errorStartMsg + ', но дата начала меньше мин даты, и дата конца больше макс даты. ' +
                        'Дата начала выбрана минимально возможная. Дата конца выбрана максимально возможная');
                    this.startDate = this.minDate;
                    this.endDate = this.maxDate;
                    this.hasSelection = true;
                }
            } else {
                // Проверка, что дата начала < даты конца
                if (!this.compareDates(new Date(options.startDate), new Date(options.endDate))) {
                    alert(this.errorStartMsg + ', но дата начала больше даты конца.' + this.errorEndMsg2);
                    this.startDate = new Date(options.minDate);
                    this.endDate = new Date(options.maxDate);
                } else {
                    this.startDate = new Date(options.startDate);
                    this.endDate = new Date(options.endDate);
                    this.hasSelection = true;
                }
            }
        }
    }

    minMaxDatesToDefault() {
        this.minDate = this.defaultMinDate;
        this.maxDate = this.defaultMaxDate;
    }

    parseDate(dateInput) {
        if (!dateInput && dateInput !== 0) return null; // 1) Отсев null, undefined, пустой строки, 0, false
        if (dateInput instanceof Date) return new Date(dateInput); // 2) Если это уже Date - возвращаем копию
        if (typeof dateInput === 'boolean') return null; // 3) Отсев булевых значений
        if (Array.isArray(dateInput)) return null; // 4) Отсев массивов
        if (typeof dateInput === 'number') return null; // 5) Отсев чисел

        // 6) Отсев объектов, кроме Date
        if (typeof dateInput === 'object' && !(dateInput instanceof Date)) {
            return null;
        }

        // 7. Проверка строки на соответствие форматам даты
        if (typeof dateInput === 'string') {
            if (dateInput.trim() === '') return null; // Отсев пустых строк
            if (/^\d+$/.test(dateInput)) return null; // Отсев числовых строк - timestamp виде строки

            // Попытка парсинга строки как даты
            const parsed = new Date(dateInput);
            return isNaN(parsed.getTime()) ? null : parsed;
        }
        return null; // 8) Для всех остальных случаев возвращаем null
    }

    compareDates(date1, date2) {
        return date1 < date2;
    }

    init() {
        this.render();
        this.bindEvents();
        this.updateTimeline();
    }

    render() {
        this.container.innerHTML = `
        <div class="timeline-slider">
            <div class="timeline-switcher">
                <button class="mode-btn years-mode active">Все года</button>
                <button class="mode-btn months-mode">Месяца</button>
            </div>

            <div class="timeline-container">
                <div class="timeline-track"></div>
                ${this.hasSelection ? `
                <div class="timeline-period"></div>
                <div class="timeline-handle start-handle"></div>
                <div class="timeline-handle end-handle"></div>
                <div class="timeline-tooltip start-tooltip"></div>
                <div class="timeline-tooltip end-tooltip"></div>
                ` : ''}
            </div>
        </div>`;
    }

    bindEvents() {
        // Переключение режимов
        this.container.querySelector('.years-mode').addEventListener('click', () => {
            this.setMode('years');
        });

        this.container.querySelector('.months-mode').addEventListener('click', () => {
            this.setMode('months');
        });
    }

    setMode(mode) {
        this.mode = mode;
        this.updateTimeline();

        // Обновляем активные кнопки
        this.container.querySelector('.years-mode').classList.toggle('active', mode === 'years');
        this.container.querySelector('.months-mode').classList.toggle('active', mode === 'months');
    }

    updateTimeline() {
        const track = this.container.querySelector('.timeline-track');
        track.innerHTML = ''; // Очистка слайдера
        this.mode === 'years' ? this.renderYears(track) : this.renderMonths(track); // Рендер меток

        if (!this.hasSelection) return; // Проверка, валиден ли выбранный период дат начала и конца

        // Вычисление месяцев всего слайдера, месяцев от мин даты до даты начала, месяцев от даты конца до макс даты
        const totalMonths = this.monthDiff(this.minDate, this.maxDate);
        const startOffset = this.monthDiff(this.minDate, this.startDate);
        const endOffset = this.monthDiff(this.minDate, this.endDate);

        // Нахождение основных элементов слайдера и присвоение их в переменные
        const period = this.container.querySelector('.timeline-period');
        const startHandle = this.container.querySelector('.start-handle');
        const endHandle = this.container.querySelector('.end-handle');
        const startTooltip = this.container.querySelector('.start-tooltip');
        const endTooltip = this.container.querySelector('.end-tooltip');

        // Обновляем позиции элементов
        const startPos = (startOffset / totalMonths) * 100;
        const endPos = (endOffset / totalMonths) * 100;
        period.style.left = `${startPos}%`;
        period.style.width = `${endPos - startPos}%`;
        startHandle.style.left = `${startPos}%`;
        endHandle.style.left = `${endPos}%`;

        // Обновляем тултипы
        this.formatTooltip(startTooltip, this.startDate);
        this.formatTooltip(endTooltip, this.endDate);
        startTooltip.style.left = `${startPos}%`;
        endTooltip.style.left = `${endPos}%`;
    }

    renderYears(track) {
        const startYear = this.minDate.getFullYear();
        const endYear = this.maxDate.getFullYear();
        const monthOfStartYear = this.minDate.getMonth();
        for (let year = startYear; year <= endYear; year++) {
            const yearElement = document.createElement('div');
            yearElement.className = 'timeline-year';
            yearElement.textContent = `${year}`;
            yearElement.style.color = '#999';
            const date = new Date(year, 0, 1);
            const offset = this.monthDiff(this.minDate, date);
            const totalMonths = this.monthDiff(this.minDate, this.maxDate);
            const position = (offset / totalMonths) * 100;
            yearElement.style.left = `${position}%`;
            track.appendChild(yearElement);
            // Удаление первого года, если дата начинается не с января
            if (year === startYear && monthOfStartYear > 0) {
                yearElement.remove();
            }
        }
    }

    renderMonths(track) {
        const startYear = this.minDate.getFullYear();
        const endYear = this.maxDate.getFullYear();
        const totalYears = endYear - startYear + 1;
        const settings = this.monthDisplaySettings;

        // Определяем шаг отображения месяцев на основе общего количества лет
        if (totalYears <= settings.byOneMonthMode) {
            this.monthStep = settings.oneMonthStep; // Все месяцы
        } else if (totalYears <= settings.byTwoMonthsThreshold) {
            this.monthStep = settings.twoMonthsStep; // Каждый 2-й месяц
        } else if (totalYears <= settings.byThreeMonthsThreshold) {
            this.monthStep = settings.threeMonthsStep; // Каждый 3-й месяц
        } else if (totalYears <= settings.byFourMonthsThreshold) {
            this.monthStep = settings.fourMonthsStep; // Каждый 4-й месяц
        } else if (totalYears <= settings.bySixMonthsThreshold) {
            this.monthStep = settings.sixMonthsStep; // Каждый 6-й месяц
        } else {
            this.monthStep = settings.noMonthStep; // Не отображать месяца
        }

        const monthOfStartYear = this.minDate.getMonth();
        for (let year = startYear; year <= endYear; year++) {
            const monthsInYear = year === endYear ? this.maxDate.getMonth() + 1 : 12;
            const startMonth = year === startYear ? this.minDate.getMonth() : 0;
            const yearElement = document.createElement('div'); // Отображаем год
            yearElement.className = 'timeline-year rotate45';
            yearElement.textContent = `${year}`;
            const yearDate = new Date(year, 0, 1);
            const yearOffset = this.monthDiff(this.minDate, yearDate);
            const totalMonths = this.monthDiff(this.minDate, this.maxDate);
            const yearPosition = (yearOffset / totalMonths) * 100;
            yearElement.style.left = `${yearPosition}%`;
            track.appendChild(yearElement);

            // Добавляем месяцы
            for (let month = startMonth; month < monthsInYear; month++) {
                if (month === 0) continue; // Пропускаем январь (он уже отмечен годом)
                if (month % this.monthStep !== 0) continue; // Показываем только каждый monthStep-й месяц
                const monthElement = document.createElement('div');
                monthElement.className = 'timeline-month rotate45';
                monthElement.textContent = this.shortMonthNames[month]; // Получаем короткое название месяца (3 буквы)
                const monthDate = new Date(year, month, 1);
                const monthOffset = this.monthDiff(this.minDate, monthDate);
                const totalMonths = this.monthDiff(this.minDate, this.maxDate);
                const monthPosition = (monthOffset / totalMonths) * 100;
                monthElement.style.left = `${monthPosition}%`;
                track.appendChild(monthElement);

            }
            // Удаление первого года, если дата начинается не с января
            if (year === startYear && monthOfStartYear > 0 ||year === startYear && monthOfStartYear === 12) {
                yearElement.remove();
            }
        }
    }

    monthDiff(date1, date2) {
        return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
    }

    formatTooltip(element, date) {
        element.innerHTML = '';
        const monthElement = document.createElement('div');
        const yearElement = document.createElement('div');
        monthElement.textContent = this.fullMonthNames[date.getMonth()];
        yearElement.textContent = date.getFullYear();
        element.appendChild(monthElement);
        element.appendChild(yearElement);
    }
}