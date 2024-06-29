import { IUseCase } from "src/common/interface/usecase/usecase.interface";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";

export interface IBrowseLecturesUseCase extends IUseCase<void, LectureDto[]> {}
