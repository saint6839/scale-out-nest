export class LectureDetailDto {
  readonly id: number;
  readonly lectureId: number;
  readonly enrollAt: Date;
  readonly lectureAt: Date;
  readonly capacity: number;
  readonly currentEnrollment: number;

  constructor(
    id: number,
    lectureId: number,
    enrollAt: Date,
    lectureAt: Date,
    capacity: number,
    currentEnrollment: number
  ) {
    this.id = id;
    this.lectureId = lectureId;
    this.enrollAt = enrollAt;
    this.lectureAt = lectureAt;
    this.capacity = capacity;
    this.currentEnrollment = currentEnrollment;
  }
}
