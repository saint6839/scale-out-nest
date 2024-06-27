import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureDetailMapper } from "./domain/mapper/lecture-detail.mapper";
import { LectureEnrollmentHistoryMapper } from "./domain/mapper/lecture-enrollment-history.mapper";
import { LectureMapper } from "./domain/mapper/lecture.mapper";
import { LectureDetailEntity } from "./infrastructure/entity/lecture-detail.entity";
import { LectureEnrollmentHistoryEntity } from "./infrastructure/entity/lecture-enrollment-history.entity";
import { LectureEntity } from "./infrastructure/entity/lecture.entity";
import { LectureDetailRepository } from "./infrastructure/repository/lecture-detail.repository";
import { LectureEnrollmentHistoryRepository } from "./infrastructure/repository/lecture-enrollment-history.repository";
import { LectureRepository } from "./infrastructure/repository/lecture.repository";
import { LectureController } from "./presentation/controller/lecutre.controller";
import { BrowseLectureEnrollmentHistoriesUseCase } from "./usecase/browse-lecture-enrollment-histories.usecase";
import { BrowseLecturesUseCase } from "./usecase/browse-lectures.usecase";
import { CreateLectureUseCase } from "./usecase/create-lecture.usecase";
import { EnrollLectureUseCase } from "./usecase/enroll-lecture.usecase";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureEntity,
      LectureEnrollmentHistoryEntity,
      LectureDetailEntity,
    ]),
  ],
  providers: [
    {
      provide: LectureRepository.name,
      useClass: LectureRepository,
    },
    {
      provide: LectureEnrollmentHistoryRepository.name,
      useClass: LectureEnrollmentHistoryRepository,
    },
    {
      provide: LectureDetailRepository.name,
      useClass: LectureDetailRepository,
    },
    {
      provide: CreateLectureUseCase.name,
      useClass: CreateLectureUseCase,
    },
    {
      provide: EnrollLectureUseCase.name,
      useClass: EnrollLectureUseCase,
    },
    {
      provide: BrowseLectureEnrollmentHistoriesUseCase.name,
      useClass: BrowseLectureEnrollmentHistoriesUseCase,
    },
    {
      provide: BrowseLecturesUseCase.name,
      useClass: BrowseLecturesUseCase,
    },
    LectureMapper,
    LectureEnrollmentHistoryMapper,
    LectureDetailMapper,
  ],
  controllers: [LectureController],
})
export class LectureModule {}
