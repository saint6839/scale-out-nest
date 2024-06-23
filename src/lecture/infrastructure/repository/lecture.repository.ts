import { ILectureRepository } from "src/lecture/domain/interface/repository/lecture.repository.interface";
import { Lecture } from "./../../domain/entity/lecture";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LectureEntity } from "../entity/lecture.entity";
import { Repository } from "typeorm";

@Injectable()
export class LectureRepository implements ILectureRepository {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>
  ) {}
  async create(lecture: Lecture): Promise<LectureEntity> {
    const lectureEntity = LectureEntity.fromDomain(lecture);
    return await this.lectureRepository.save(lectureEntity);
  }
}
