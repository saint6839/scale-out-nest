export class Lecture {
  private _id: number;
  private _name: string;
  private _startAt: Date;
  private _capacity: number;
  private _currentEnrollment: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: number,
    name: string,
    startAt: Date,
    capacity: number,
    currentEnrollment: number = 0,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._startAt = startAt;
    this._capacity = capacity;
    this._currentEnrollment = currentEnrollment;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
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
    return new Lecture(0, name, startAt, capacity, 0);
  }
}
