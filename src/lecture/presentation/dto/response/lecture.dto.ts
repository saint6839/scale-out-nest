import { LectureDetailDto } from "./lecture-detail.dto";

export class LectureDto {
  readonly id: number;
  readonly name: string;
  readonly lectureDetails: LectureDetailDto[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    id: number,
    name: string,
    lectureDetails: LectureDetailDto[],
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.lectureDetails = lectureDetails;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
