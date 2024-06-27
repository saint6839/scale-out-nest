import { IUseCase } from "src/common/interface/usecase/usecase.interface";
import { EnrollLectureDto } from "src/lecture/presentation/dto/request/enroll-lecture.dto";

export interface IEnrollLectureUseCase
  extends IUseCase<EnrollLectureDto, void> {}
