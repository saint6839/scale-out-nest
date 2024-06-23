import { Injectable } from "@nestjs/common";
import { LectureApplicationHistory } from "src/lecture/domain/entity/lecture-application-history";
import { ILectureApplicationHistoryRepository } from "src/lecture/domain/interface/repository/lecture-application-history.repository.interface";
import { EntityManager } from "typeorm";
import { LectureApplicationHistoryEntity } from "../entity/lecture-application-history.entity";

@Injectable()
export class LectureApplicationHistoryRepository
  implements ILectureApplicationHistoryRepository
{
  async create(
    lectureApplicationHistory: LectureApplicationHistory,
    entityManager: EntityManager
  ): Promise<LectureApplicationHistoryEntity> {
    throw new Error("Method not implemented.");
  }

  async findById(
    id: number,
    entityManager: EntityManager
  ): Promise<LectureApplicationHistoryEntity> {
    throw new Error("Method not implemented.");
  }
}
