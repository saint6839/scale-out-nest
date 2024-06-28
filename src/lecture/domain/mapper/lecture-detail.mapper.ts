import { Injectable } from "@nestjs/common";
import { LectureDetailEntity } from "src/lecture/infrastructure/entity/lecture-detail.entity";
import { LectureDetail } from "../entity/lecture-detail";

@Injectable()
export class LectureDetailMapper {
  toDomainFromEntity(entity: LectureDetailEntity): LectureDetail {
    return entity
      ? new LectureDetail(
          entity.id,
          entity.lectureId,
          entity.enrollAt,
          entity.lectureAt,
          entity.capacity,
          entity.currentEnrollment
        )
      : null;
  }
}
