1) git clone https://github.com/MatveevArty/timelineSlider.git .
2) index.html

Настройка передаваемых мин/макс дат и выбранных дат начала/конца в main.js.
Даты передаются в формате строки, например "2010-10-15" - 15 октября 2010 г.
Валидация дат отсеивает null, undefined, 0, любые пустые строки, объекты, массивы, булевы значения, числа.
Валидация сравнения дат жёстко регулирует передаваемые даты.
Максимальный диапазон мин/макс дат - 20 лет.
Адаптив реализован только на css.

Для подключения модуля в другой проект и создания объекта TimelineSlider:
<link rel="stylesheet" href="timeline-slider.css">
<script src="timeline-slider.js" type="module"></script>

new TimelineSlider({
    minDate: '2014-01-01',
    maxDate: '2021-01-01',
    startDate: '2015-05-01',
    endDate: '2017-09-01',
    containerId: 'my-timeline',
});
