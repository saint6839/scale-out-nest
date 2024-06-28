export class LectureDetailDto {
  readonly id: number;
  readonly lectureId: number;
  readonly enrollAt: Date;
  readonly capacity: number;
  readonly currentEnrollment: number;

  constructor(
    id: number,
    lectureId: number,
    enrollAt: Date,
    capacity: number,
    currentEnrollment: number
  ) {
    this.id = id;
    this.lectureId = lectureId;
    this.enrollAt = enrollAt;
    this.capacity = capacity;
    this.currentEnrollment = currentEnrollment;
  }
}
