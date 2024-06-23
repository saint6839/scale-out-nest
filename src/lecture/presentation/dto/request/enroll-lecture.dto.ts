export class EnrollLectureDto {
  readonly userId: string;
  readonly lectureId: string;

  constructor(userId: string, lectureId: string) {
    this.userId = userId;
    this.lectureId = lectureId;
  }
}
