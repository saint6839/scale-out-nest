export class LectureEnrollmentHistory {
  private _id: number;
  private _lectureDetailId: number;
  private _userId: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    lectureDetailId: number,
    userId: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._lectureDetailId = lectureDetailId;
    this._userId = userId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): number {
    return this._id;
  }

  get lectureDetailId(): number {
    return this._lectureDetailId;
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

  static create(
    lectureDetailId: number,
    userId: number
  ): LectureEnrollmentHistory {
    return new LectureEnrollmentHistory(0, lectureDetailId, userId);
  }
}
