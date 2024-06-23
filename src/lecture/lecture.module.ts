import { ILectureRepository } from "./domain/interface/repository/lecture.repository.interface";
import { CreateLectureUseCase } from "./usecase/create-lecture.usecase";
import { LectureRepository } from "./infrastructure/repository/lecture.repository";
import { Module } from "@nestjs/common";
import { LectureMapper } from "./domain/mapper/lecture.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureEntity } from "./infrastructure/entity/lecture.entity";
import { LectureController } from "./presentation/controller/lecutre.controller";
import { EnrollLectureUseCase } from "./usecase/enroll-lecture.usecase";
import { LectureApplicationHistory } from "./domain/entity/lecture-application-history";

@Module({
  imports: [TypeOrmModule.forFeature([LectureEntity])],
  providers: [
    {
      provide: LectureRepository.name,
      useClass: LectureRepository,
    },
    {
      provide: LectureApplicationHistory.name,
      useClass: LectureApplicationHistory,
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
  ],
  controllers: [LectureController],
})
export class LectureModule {}
