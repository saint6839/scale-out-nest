export class EnrollLectureDto {
  readonly userId: number;
  readonly lectureId: number;

  constructor(userId: number, lectureId: number) {
    this.userId = userId;
    this.lectureId = lectureId;
  }
}
