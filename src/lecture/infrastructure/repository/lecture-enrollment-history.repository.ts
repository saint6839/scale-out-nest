import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LectureEnrollmentHistory } from "src/lecture/domain/entity/lecture-enrollment-history";
import { ILectureEnrollmentHistoryRepository } from "src/lecture/domain/interface/repository/lecture-enrollment-history.repository.interface";
import { EntityManager, Repository } from "typeorm";
import { LectureEnrollmentHistoryEntity } from "../entity/lecture-enrollment-history.entity";

@Injectable()
export class LectureEnrollmentHistoryRepository
  implements ILectureEnrollmentHistoryRepository
{
  constructor(
    @InjectRepository(LectureEnrollmentHistoryEntity)
    private readonly repository: Repository<LectureEnrollmentHistoryEntity>
  ) {}

  async findByUserId(
    userId: number,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistoryEntity[]> {
    return await entityManager.find(LectureEnrollmentHistoryEntity, {
      where: { userId },
    });
  }
  async create(
    lectureApplicationHistory: LectureEnrollmentHistory,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistoryEntity> {
    const entity = LectureEnrollmentHistoryEntity.fromDomain(
      lectureApplicationHistory
    );
    return await entityManager.save(entity);
  }

  async findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistoryEntity> {
    throw new Error("Method not implemented.");
  }

  async findByLectureIdAndUserId(
    lectureId: number,
    userId: number,
    entityManager: EntityManager
  ): Promise<LectureEnrollmentHistoryEntity> {
    return await entityManager.findOne(LectureEnrollmentHistoryEntity, {
      where: { lectureId, userId },
    });
  }
}
