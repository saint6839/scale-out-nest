export class LectureDto {
  readonly id: number;
  readonly name: string;
  readonly startAt: Date;
  readonly capacity: number;
  readonly currentEnrollment: number;

  constructor(
    id: number,
    name: string,
    startAt: Date,
    capacity: number,
    currentEnrollment: number
  ) {
    this.id = id;
    this.name = name;
    this.startAt = startAt;
    this.capacity = capacity;
    this.currentEnrollment = currentEnrollment;
  }
}
