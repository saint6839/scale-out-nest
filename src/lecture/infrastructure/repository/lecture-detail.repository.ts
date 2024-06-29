import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LectureDetail } from "src/lecture/domain/entity/lecture-detail";
import { LockMode } from "src/lecture/domain/enum/lock-mode.enum";
import { ILectureDetailRepository } from "src/lecture/domain/interface/repository/lecture-deteail.repository.interface";
import { EntityManager, Repository } from "typeorm";
import { LectureDetailEntity } from "../entity/lecture-detail.entity";

@Injectable()
export class LectureDetailRepository implements ILectureDetailRepository {
  constructor(
    @InjectRepository(LectureDetailEntity)
    private readonly repository: Repository<LectureDetailEntity>
  ) {}

  async findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureDetailEntity> {
    return await entityManager.findOne(LectureDetailEntity, { where: { id } });
  }

  async findByIdWithLock(
    id: number,
    entityManager: EntityManager,
    lockMode: LockMode
  ): Promise<LectureDetailEntity> {
    return await entityManager.findOne(LectureDetailEntity, {
      where: { id },
      lock: { mode: lockMode },
    });
  }

  async update(
    lectureDetail: LectureDetail,
    entityManager: EntityManager
  ): Promise<LectureDetailEntity> {
    const entity = LectureDetailEntity.fromDomain(lectureDetail);
    await entityManager.update(
      LectureDetailEntity,
      { id: lectureDetail.id },
      {
        ...entity,
      }
    );

    return await entityManager.findOne(LectureDetailEntity, {
      where: { id: lectureDetail.id },
    });
  }

  async create(
    lectureDetail: LectureDetail,
    entityManager: EntityManager
  ): Promise<LectureDetailEntity> {
    const entity = LectureDetailEntity.fromDomain(lectureDetail);
    return await entityManager.save(entity);
  }

  async findByLectureId(lectureId: number): Promise<LectureDetailEntity[]> {
    return await this.repository.find({ where: { lectureId } });
  }
}
