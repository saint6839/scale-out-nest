export class LectureDto {
  readonly id: number;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(id: number, name: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
