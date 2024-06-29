export class EnrollLectureDto {
  readonly userId: number;
  readonly lectureDetailId: number;

  constructor(userId: number, lectureDetailId: number) {
    this.userId = userId;
    this.lectureDetailId = lectureDetailId;
  }
}
