import { Lecture } from "src/lecture/domain/entity/lecture";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("lectures")
export class LectureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static fromDomain(domain: Lecture): LectureEntity {
    const entity = new LectureEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
