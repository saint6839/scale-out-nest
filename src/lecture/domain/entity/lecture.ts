export const CAPACITY_EXCEPTION_MESSAGE = "수강 신청 인원이 꽉 찼습니다.";
export const CANT_ENROLL_TIME_EXCEPTION_MESSAGE = "수강 신청 시간이 아닙니다.";
export class Lecture {
  private _version: number;
  private _id: number;
  private _name: string;
  private _startAt: Date;
  private _capacity: number;
  private _currentEnrollment: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    version: number = 0,
    id: number,
    name: string,
    startAt: Date,
    capacity: number,
    currentEnrollment: number = 0,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._version = version;
    this._id = id;
    this._name = name;
    this._startAt = startAt;
    this._capacity = capacity;
    this._currentEnrollment = currentEnrollment;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get version(): number {
    return this._version;
  }

  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get startAt(): Date {
    return this._startAt;
  }
  get capacity(): number {
    return this._capacity;
  }
  get currentEnrollment(): number {
    return this._currentEnrollment;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(name: string, startAt: Date, capacity: number): Lecture {
    return new Lecture(0, 0, name, startAt, capacity, 0);
  }

  /**
   * @description 수강 신청 인원을 증가시킨다.
   * @throws {Error} 수강 신청 인원이 꽉 찼을 때 발생한다.
   */
  public increaseEnrollment(): void {
    if (this._currentEnrollment >= this._capacity) {
      throw new Error(CAPACITY_EXCEPTION_MESSAGE);
    }
    this._currentEnrollment++;
  }

  /**
   * @description 요청이 들어온 시간이 startAt 이후인지 확인한다.
   * @throws {Error} 요청이 들어온 시간이 startAt 이후가 아닐 때 발생한다.
   */
  public validateEnrollStartAt(currentTime: Date): void {
    if (currentTime.getTime() < this._startAt.getTime()) {
      throw new Error(CANT_ENROLL_TIME_EXCEPTION_MESSAGE);
    }
  }
}
