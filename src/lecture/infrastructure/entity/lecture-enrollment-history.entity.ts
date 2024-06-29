import { LectureEnrollmentHistory } from "src/lecture/domain/entity/lecture-enrollment-history";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("lecture_enrollments_histories")
export class LectureEnrollmentHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lectureDetailId: number;

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
    entity.lectureDetailId = domain.lectureDetailId;
    entity.userId = domain.userId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
