import { Injectable } from "@nestjs/common";
import { LectureEnrollmentHistoryEntity } from "src/lecture/infrastructure/entity/lecture-enrollment-history.entity";
import { LectureEnrollmentHistory } from "../entity/lecture-enrollment-history";

@Injectable()
export class LectureEnrollmentHistoryMapper {
  toDomainFromEntity(
    entity: LectureEnrollmentHistoryEntity
  ): LectureEnrollmentHistory {
    return entity
      ? new LectureEnrollmentHistory(
          entity.id,
          entity.lectureDetailId,
          entity.userId,
          entity.createdAt,
          entity.updatedAt
        )
      : null;
  }
}
