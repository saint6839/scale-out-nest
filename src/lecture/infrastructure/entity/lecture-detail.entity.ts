import { LectureDetail } from "src/lecture/domain/entity/lecture-detail";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("lecture_details")
export class LectureDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lectureId: number;

  @Column({ type: "timestamp" })
  enrollAt: Date;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  currentEnrollment: number;

  static fromDomain(domain: LectureDetail): LectureDetailEntity {
    const entity = new LectureDetailEntity();
    entity.id = domain.id;
    entity.enrollAt = domain.enrollAt;
    entity.capacity = domain.capacity;
    entity.currentEnrollment = domain.currentEnrollment;
    return entity;
  }
}
