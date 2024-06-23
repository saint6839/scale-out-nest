export class CreateLectureDto {
  readonly name: string;
  readonly startAt: Date;
  readonly capacity: number;

  constructor(name: string, startAt: Date, capacity: number) {
    this.name = name;
    this.startAt = startAt;
    this.capacity = capacity;
  }
}
