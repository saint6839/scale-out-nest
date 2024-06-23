import { ILectureRepository } from "./domain/interface/repository/lecture.repository.interface";
import { EnrollLectureUseCase } from "./usecase/enroll-lecture.usecase";
import { LectureRepository } from "./infrastructure/repository/lecture.repository";
import { Module } from "@nestjs/common";
import { LectureMapper } from "./domain/mapper/lecture.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureEntity } from "./infrastructure/entity/lecture.entity";
import { LectureController } from "./presentation/controller/lecutre.controller";

@Module({
  imports: [TypeOrmModule.forFeature([LectureEntity])],
  providers: [
    {
      provide: LectureRepository.name,
      useClass: LectureRepository,
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
