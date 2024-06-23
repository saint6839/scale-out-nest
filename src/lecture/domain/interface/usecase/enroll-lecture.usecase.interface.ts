import { IUseCase } from "src/common/interface/usecase/usecase.interface";
import { EnrollLectureDto } from "src/lecture/presentation/dto/request/enroll-lecture.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";

export interface IEnrollLectureUseCase
  extends IUseCase<EnrollLectureDto, LectureDto> {}
