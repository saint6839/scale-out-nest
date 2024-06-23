import { ILectureRepository } from "./domain/interface/repository/lecture.repository.interface";
import { CreateLectureUseCase } from "./usecase/create-lecture.usecase";
import { LectureRepository } from "./infrastructure/repository/lecture.repository";
import { Module } from "@nestjs/common";
import { LectureMapper } from "./domain/mapper/lecture.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureEntity } from "./infrastructure/entity/lecture.entity";
import { LectureController } from "./presentation/controller/lecutre.controller";
import { EnrollLectureUseCase } from "./usecase/enroll-lecture.usecase";
import { LectureEnrollmentHistoryMapper } from "./domain/mapper/lecture-enrollment-history.mapper";
import { LectureEnrollmentHistoryEntity } from "./infrastructure/entity/lecture-enrollment-history.entity";
import { LectureEnrollmentHistoryRepository } from "./infrastructure/repository/lecture-enrollment-history.repository";

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
    LectureMapper,
    LectureEnrollmentHistoryMapper,
  ],
  controllers: [LectureController],
})
export class LectureModule {}
