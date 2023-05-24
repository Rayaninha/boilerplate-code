import { AddMinutesProps, IAddDaysDateProvider, IDateProvider } from '../types';
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  differenceInSeconds,
  endOfMonth,
  getISODay,
  getMonth,
  isAfter,
  isPast,
  parseISO,
  startOfMonth,
} from 'date-fns';

export class DateProvider implements IDateProvider {
  addMinutes({ date, minutesToAdd }: AddMinutesProps): Date {
    return addMinutes(date, minutesToAdd);
  }
  addDays({ date, daysToAdd }: IAddDaysDateProvider): Date {
    return addDays(date, daysToAdd);
  }
  dateNow(): Date {
    return new Date(Date.now());
  }
  startMonth(date: Date): Date {
    return startOfMonth(date);
  }
  getMonthByDate(date: Date): number {
    return getMonth(date);
  }
  getDayByDate(date: Date): number {
    return getISODay(date);
  }
  endMonth(date: Date): Date {
    return endOfMonth(date);
  }
  parse(date: string): Date {
    return parseISO(date);
  }
  itPast(date: Date): boolean {
    return isPast(date);
  }
  diffInSeconds(date: Date, dateToCompare: Date) {
    return differenceInSeconds(date, dateToCompare);
  }
  diffInMinutes(date: Date, dateToCompare: Date) {
    return differenceInMinutes(date, dateToCompare);
  }
  dateIsAfter(date: Date, dateToCompare: Date) {
    return isAfter(dateToCompare, date);
  }
}
