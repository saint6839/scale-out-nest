import { Lecture } from "src/lecture/domain/entity/lecture";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("lectures")
export class LectureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "timestamp" })
  startAt: Date;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  currentEnrollment: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDomain(domain: Lecture): LectureEntity {
    const entity = new LectureEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.startAt = domain.startAt;
    entity.capacity = domain.capacity;
    entity.currentEnrollment = domain.currentEnrollment;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
