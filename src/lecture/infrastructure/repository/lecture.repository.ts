import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LockMode } from "src/lecture/domain/enum/lock-mode.enum";
import { ILectureRepository } from "src/lecture/domain/interface/repository/lecture.repository.interface";
import { EntityManager, Repository } from "typeorm";
import { LectureEntity } from "../entity/lecture.entity";
import { Lecture } from "./../../domain/entity/lecture";

@Injectable()
export class LectureRepository implements ILectureRepository {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>
  ) {}

  async findByIdWithLock(
    id: number,
    entityManager: EntityManager,
    lockMode: LockMode
  ): Promise<LectureEntity> {
    return await entityManager.findOne(LectureEntity, {
      where: { id },
      lock: { mode: lockMode },
    });
  }

  async findAll(): Promise<LectureEntity[]> {
    return await this.lectureRepository.find();
  }

  async update(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity> {
    const entity = LectureEntity.fromDomain(lecture);
    await entityManager.update(
      LectureEntity,
      { id: lecture.id },
      {
        ...entity,
      }
    );

    return await entityManager.findOne(LectureEntity, {
      where: { id: lecture.id },
    });
  }

  async findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureEntity> {
    return await entityManager.findOne(LectureEntity, { where: { id } });
  }

  async create(
    lecture: Lecture,
    entityManager: EntityManager
  ): Promise<LectureEntity> {
    const lectureEntity = LectureEntity.fromDomain(lecture);
    return await entityManager.save(lectureEntity);
  }
}
