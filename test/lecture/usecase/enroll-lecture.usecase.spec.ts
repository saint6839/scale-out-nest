import { Test, TestingModule } from "@nestjs/testing";
import { LectureMapper } from "src/lecture/domain/mapper/lecture.mapper";
import { LectureRepository } from "src/lecture/infrastructure/repository/lecture.repository";
import { EnrollLectureUseCase } from "src/lecture/usecase/enroll-lecture.usecase";
import { DataSource } from "typeorm";

describe("EnrollLectureUseCase", () => {
  let useCase: EnrollLectureUseCase;
  let lectureRepositoryMock: jest.Mocked<LectureRepository>;
  let lectureMapperMock: jest.Mocked<LectureMapper>;
  let dataSourceMock: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollLectureUseCase,
        {
          provide: LectureRepository.name,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: LectureMapper,
          useValue: {
            toDto: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<EnrollLectureUseCase>(EnrollLectureUseCase);
    lectureRepositoryMock = module.get(LectureRepository.name);
    lectureMapperMock = module.get(LectureMapper);
    dataSourceMock = module.get(DataSource);
  });
});
