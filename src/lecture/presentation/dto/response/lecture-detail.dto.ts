export class LectureDetailDto {
  readonly id: number;
  readonly lectureId: number;
  readonly startAt: Date;
  readonly capacity: number;
  readonly currentEnrollment: number;

  constructor(
    id: number,
    lectureId: number,
    startAt: Date,
    capacity: number,
    currentEnrollment: number
  ) {
    this.id = id;
    this.lectureId = lectureId;
    this.startAt = startAt;
    this.capacity = capacity;
    this.currentEnrollment = currentEnrollment;
  }
}
