export class LectureDto {
  readonly id: number;
  readonly name: string;
  readonly startAt: Date;
  readonly capacity: number;
  readonly currentEnrollment: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    id: number,
    name: string,
    startAt: Date,
    capacity: number,
    currentEnrollment: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.startAt = startAt;
    this.capacity = capacity;
    this.currentEnrollment = currentEnrollment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
