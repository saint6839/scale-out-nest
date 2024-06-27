export const CAPACITY_EXCEPTION_MESSAGE = "수강 신청 인원이 꽉 찼습니다.";
export const CANT_ENROLL_TIME_EXCEPTION_MESSAGE = "수강 신청 시간이 아닙니다.";

export class LectureDetail {
  private _id: number;
  private _lectureId: number;
  private _startAt: Date;
  private _capacity: number;
  private _currentEnrollment: number;

  constructor(
    id: number,
    lectureId: number,
    startAt: Date,
    capacity: number,
    currentEnrollment: number
  ) {
    this._id = id;
    this._lectureId = lectureId;
    this._startAt = startAt;
    this._capacity = capacity;
    this._currentEnrollment = currentEnrollment;
  }

  get id(): number {
    return this._id;
  }

  get lectureId(): number {
    return this._lectureId;
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
