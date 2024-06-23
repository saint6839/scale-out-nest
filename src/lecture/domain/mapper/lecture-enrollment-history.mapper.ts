import { Injectable } from "@nestjs/common";
import { LectureEnrollmentHistory } from "../entity/lecture-enrollment-history";
import { LectureEnrollmentHistoryEntity } from "src/lecture/infrastructure/entity/lecture-enrollment-history.entity";

@Injectable()
export class LectureEnrollmentHistoryMapper {
  toDomainFromEntity(
    entity: LectureEnrollmentHistoryEntity
  ): LectureEnrollmentHistory {
    return entity
      ? new LectureEnrollmentHistory(
          entity.id,
          entity.lectureId,
          entity.userId,
          entity.createdAt,
          entity.updatedAt
        )
      : null;
  }
}
