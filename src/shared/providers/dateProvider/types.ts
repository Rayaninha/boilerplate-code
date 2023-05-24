export interface IDateProvider {
  dateNow(): Date;
  addDays({ date, daysToAdd }: IAddDaysDateProvider): Date;
  addMinutes(payload: AddMinutesProps): Date;
}
export interface IAddDaysDateProvider {
  date: Date;
  daysToAdd: number;
}

export type AddMinutesProps = {
  date: Date;
  minutesToAdd: number;
};
