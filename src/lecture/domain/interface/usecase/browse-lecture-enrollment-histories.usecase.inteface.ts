import { IUseCase } from "src/common/interface/usecase/usecase.interface";
import { BrowseLectureEnrollmentHistoriesDto } from "src/lecture/presentation/dto/request/browse-lecture-enrollment-histories.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";

export interface IBrowseLectureEnrollmentHistoriesUseCase
  extends IUseCase<BrowseLectureEnrollmentHistoriesDto, LectureDto[]> {}
