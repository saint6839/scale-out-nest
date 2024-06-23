export class LectureApplicationHistory {
  private _id: number;
  private _lectureId: number;
  private _userId: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    lectureId: number,
    userId: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id;
    this._lectureId = lectureId;
    this._userId = userId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): number {
    return this._id;
  }

  get lectureId(): number {
    return this._lectureId;
  }

  get userId(): number {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
