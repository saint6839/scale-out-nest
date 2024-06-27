import { Injectable } from "@nestjs/common";
import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";
import { Lecture } from "../entity/lecture";

@Injectable()
export class LectureMapper {
  toDtoFromDomain(domain: Lecture): LectureDto {
    return domain
      ? new LectureDto(
          domain.id,
          domain.name,
          domain.createdAt,
          domain.updatedAt
        )
      : null;
  }

  toDomainFromDto(dto: LectureDto): Lecture {
    return dto ? new Lecture(dto.id, dto.name) : null;
  }

  toDomainFromEntity(entity: LectureEntity): Lecture {
    return entity ? new Lecture(entity.id, entity.name) : null;
  }

  toEntityFromDomain(domain: Lecture): LectureEntity {
    return domain ? LectureEntity.fromDomain(domain) : null;
  }
}
