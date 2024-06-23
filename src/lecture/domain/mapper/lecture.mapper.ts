import { Injectable } from "@nestjs/common";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";
import { Lecture } from "../entity/lecture";
import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";

@Injectable()
export class LectureMapper {
  toDto(domain: Lecture): LectureDto {
    return new LectureDto(
      domain.id,
      domain.name,
      domain.startAt,
      domain.capacity,
      domain.currentEnrollment
    );
  }

  toDomainFromDto(dto: LectureDto): Lecture {
    return new Lecture(
      dto.id,
      dto.name,
      dto.startAt,
      dto.capacity,
      dto.currentEnrollment
    );
  }

  toDomainFromEntity(entity: LectureEntity): Lecture {
    return new Lecture(
      entity.id,
      entity.name,
      entity.startAt,
      entity.capacity,
      entity.currentEnrollment
    );
  }

  toEntity(domain: Lecture): LectureEntity {
    return LectureEntity.fromDomain(domain);
  }
}
