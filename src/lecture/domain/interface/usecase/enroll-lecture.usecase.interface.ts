import { CreateLectureDto as CreateLectureDto } from "src/lecture/presentation/dto/request/enroll-lecture.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";

export interface ICreateLectureUseCase {
  execute(dto: CreateLectureDto): Promise<LectureDto>;
}
