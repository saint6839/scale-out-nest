import { CreateLectureDto } from "src/lecture/presentation/dto/request/create-lecture.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";

export interface ICreateLectureUseCase {
  execute(dto: CreateLectureDto): Promise<LectureDto>;
}
