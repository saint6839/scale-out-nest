import { Injectable } from "@nestjs/common";
import { LectureDetail } from "src/lecture/domain/entity/lecture-detail";
import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { LectureDetailDto } from "src/lecture/presentation/dto/response/lecture-detail.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";
import { Lecture } from "../entity/lecture";

@Injectable()
export class LectureMapper {
  toDtoFromDomain(
    domain: Lecture,
    lectureDetails: LectureDetail[] | null
  ): LectureDto {
    return domain
      ? new LectureDto(
          domain.id,
          domain.name,
          lectureDetails.map(
            (lectureDetail) =>
              new LectureDetailDto(
                lectureDetail.id,
                lectureDetail.lectureId,
                lectureDetail.enrollAt,
                lectureDetail.lectureAt,
                lectureDetail.capacity,
                lectureDetail.currentEnrollment
              )
          ),
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
