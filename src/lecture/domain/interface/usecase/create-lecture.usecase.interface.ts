import { IUseCase } from "src/common/interface/usecase/usecase.interface";
import { CreateLectureDto } from "src/lecture/presentation/dto/request/create-lecture.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";

export interface ICreateLectureUseCase
  extends IUseCase<CreateLectureDto, LectureDto> {}
