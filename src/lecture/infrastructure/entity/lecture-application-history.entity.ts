import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("lecture_application_histories")
export class LectureApplicationHistoryEntity {
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
}
