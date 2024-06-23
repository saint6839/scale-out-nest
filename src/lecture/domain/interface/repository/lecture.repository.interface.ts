import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { Lecture } from "../../entity/lecture";

export interface ILectureRepository {
  create(lecture: Lecture): Promise<LectureEntity>;
}
