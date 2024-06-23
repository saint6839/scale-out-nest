import { EnrollLectureDto } from "src/lecture/presentation/dto/request/enroll-lecture.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";

export interface IEnrollLectureUseCase {
  execute(dto: EnrollLectureDto): Promise<LectureDto>;
}
