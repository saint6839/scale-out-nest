import { LectureEnrollmentHistory } from "src/lecture/domain/entity/lecture-enrollment-history";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("lecture_application_histories")
export class LectureEnrollmentHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lectureId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDomain(
    domain: LectureEnrollmentHistory
  ): LectureEnrollmentHistoryEntity {
    const entity = new LectureEnrollmentHistoryEntity();
    entity.id = domain.id;
    entity.lectureId = domain.lectureId;
    entity.userId = domain.userId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
