import { collapseAnimation } from 'angular-calendar';

import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  subHours,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  getHours
} from 'date-fns';

import { Subject } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarMonthViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarView
} from 'angular-calendar';

import { CustomEventTitleFormatter } from './personalize/custom-event-title-formatter.provider';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  // add this to your component metadata
  animations: [collapseAnimation],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class AppComponent {

  segmentsInHour = 6;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  // just for the purposes of the demo so it all fits in one screen
  dayStartHour: number = Math.max(0, 9);

  dayEndHour: number = Math.min(23, 19);

  viewDate: Date = new Date();

  clickedDate: Date;

  clickedColumn: number;

  activeDayIsOpen = false;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="fa fa-fw fa-pencil"></i>',
    //   a11yLabel: 'Edit',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.handleEvent('Edited', event);
    //   }
    // },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  externalEvents: CalendarEvent[] = [
    {
      id: 10,
      title: 'Event 1',
      start: new Date(),
      end: addDays(new Date(), 1),
      color: colors.yellow,
      draggable: true,
      allDay: true
    },
    {
      id: 11,
      title: 'Event 2',
      start: new Date(),
      end: addDays(new Date(), 2),
      color: colors.blue,
      draggable: true
    }
  ];


  events: Array<CalendarEvent> = [
    {
      id: 1,
      title: 'An all day event',
      start: subDays(endOfMonth(new Date()), 1),
      end: addDays(endOfMonth(new Date()), 1),
      color: colors.yellow,
      allDay: true,
      draggable: true
    },
    {
      id: 2,
      start:  new Date(),
      end:  new Date(),  // an end date is always required for resizable events to work
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true, // this allows you to configure the sides the event is resizable from
        afterEnd: true
      },
      draggable: true,
      meta: {
        patient: 127455,
        note: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.'
      }
    },
    {
      id: 3,
      start:  subHours(endOfDay(new Date()), 10),
      end: endOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      meta: {
        patient: 127456,
        note: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.'
      }
    },
    {
      id: 4,
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      meta: {
        patient: 127457,
        note: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.'
      }
    },
    {
      id: 5,
      start: addHours(startOfDay(new Date()), 10),
      end: addHours(new Date(), 1),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      meta: {
        patient: 127458,
        note: 'The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting.'
      }
    }
  ];

  eventTimesChanged({
    event,
    newStart,
    newEnd,
    allDay
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.externalEvents.indexOf(event);
    const idx: number = this.events.indexOf(event);

    const newEvent = {
      ...event,
      start: newStart,
      end: newEnd
    };

    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }

    /*
     *  External event drop
     */
    if (externalIndex > -1) {
      this.externalEvents.splice(externalIndex, 1);
      this.events.push(event);

      this.handleEvent('Drop external event', event);
    }

    /*
     *  Internal event drop or resize
     */
    if (idx > -1) {
      this.events.splice(idx, 1, newEvent);

      // this.events = this.events.map(iEvent => {
      //   console.log({name: 'iEvent', obj: iEvent});
      //   console.log({name: 'event', obj: event});
      //   if (iEvent === event) {
      //     return {
      //       ...event,
      //       start: newStart,
      //       end: newEnd
      //     };
      //   }
      //   return iEvent;
      // });

      const title: string = this.dropOrResize(newEvent, event);

      this.handleEvent(title, event);

    }


    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];

    this.refresh.next();
  }

  dropOrResize(
    newEvent: CalendarEvent,
    event: CalendarEvent
  ): string {

    const {start: newStart, end: newEnd} = newEvent;
    const {start: oldStart, end: oldEnd} = event;

    console.log(newStart.getTime());
    console.log(newEnd.getTime());

    console.log(oldStart.getTime());
    console.log(oldEnd.getTime());


    const newPeriod = Math.floor(
      ( newStart.getTime() -
        newEnd.getTime()  )
      );

    const oldPeriod = Math.floor(
      ( oldStart.getTime() -
        oldEnd.getTime()  )
      );

    if (newPeriod === oldPeriod) {
      return 'Dropped';
    } else {
      return 'Resized';
    }
  }

  externalDrop(event: CalendarEvent) {
    if (this.externalEvents.indexOf(event) === -1) {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.externalEvents.push(event);
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log({ event, action });
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach(day => {
      const dayOfMonth = day.date.getDate();
      if (dayOfMonth > 5 && dayOfMonth < 10 && day.inMonth) {
        day.cssClass = 'bg-pink';
      }
    });
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach(hourColumn => {
      hourColumn.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          if (
            segment.date.getHours() >= 9 &&
            segment.date.getHours() <= 11 &&
            segment.date.getDay() === 2
          ) {
            segment.cssClass = 'bg-pink';
          }
        });
      });
    });
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach(hourColumn => {
      hourColumn.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          if (segment.date.getHours() >= 2 && segment.date.getHours() <= 5) {
            segment.cssClass = 'bg-pink';
          }
        });
      });
    });
  }

  constructor(private modal: NgbModal) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }


  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
