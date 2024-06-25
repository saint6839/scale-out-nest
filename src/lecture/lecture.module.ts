import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureEnrollmentHistoryMapper } from "./domain/mapper/lecture-enrollment-history.mapper";
import { LectureMapper } from "./domain/mapper/lecture.mapper";
import { LectureEnrollmentHistoryEntity } from "./infrastructure/entity/lecture-enrollment-history.entity";
import { LectureEntity } from "./infrastructure/entity/lecture.entity";
import { LectureEnrollmentHistoryRepository } from "./infrastructure/repository/lecture-enrollment-history.repository";
import { LectureRepository } from "./infrastructure/repository/lecture.repository";
import { LectureController } from "./presentation/controller/lecutre.controller";
import { BrowseLectureEnrollmentHistoriesUseCase } from "./usecase/browse-lecture-enrollment-histories.usecase";
import { CreateLectureUseCase } from "./usecase/create-lecture.usecase";
import { EnrollLectureUseCase } from "./usecase/enroll-lecture.usecase";

@Module({
  imports: [
    TypeOrmModule.forFeature([LectureEntity, LectureEnrollmentHistoryEntity]),
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
    LectureMapper,
    LectureEnrollmentHistoryMapper,
  ],
  controllers: [LectureController],
})
export class LectureModule {}
