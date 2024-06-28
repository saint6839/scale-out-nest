import { Test, TestingModule } from "@nestjs/testing";
import { Lecture } from "src/lecture/domain/entity/lecture";
import { LectureDetail } from "src/lecture/domain/entity/lecture-detail";
import { LectureDetailEntity } from "src/lecture/infrastructure/entity/lecture-detail.entity";
import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { LectureDetailDto } from "src/lecture/presentation/dto/response/lecture-detail.dto";
import { LectureDto } from "src/lecture/presentation/dto/response/lecture.dto";
import { LectureDetailMapper } from "../../../src/lecture/domain/mapper/lecture-detail.mapper";
import { LectureMapper } from "../../../src/lecture/domain/mapper/lecture.mapper";
import { LectureDetailRepository } from "../../../src/lecture/infrastructure/repository/lecture-detail.repository";
import { LectureRepository } from "../../../src/lecture/infrastructure/repository/lecture.repository";
import { BrowseLecturesUseCase } from "../../../src/lecture/usecase/browse-lectures.usecase";

describe("BrowseLectureUseCase", () => {
  let browseLecturesUseCase: BrowseLecturesUseCase;
  let lectureRepositoryMock: jest.Mocked<LectureRepository>;
  let lectureDetailRepositoryMock: jest.Mocked<LectureDetailRepository>;
  let lectureMapperMock: jest.Mocked<LectureMapper>;
  let lectureDetailMapperMock: jest.Mocked<LectureDetailMapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrowseLecturesUseCase,
        {
          provide: LectureRepository.name,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: LectureDetailRepository.name,
          useValue: {
            findByLectureId: jest.fn(),
          },
        },
        {
          provide: LectureMapper,
          useValue: {
            toDomainFromEntity: jest.fn(),
            toDtoFromDomain: jest.fn(),
          },
        },
        {
          provide: LectureDetailMapper,
          useValue: {
            toDomainFromEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    browseLecturesUseCase = module.get<BrowseLecturesUseCase>(
      BrowseLecturesUseCase
    );
    lectureRepositoryMock = module.get(LectureRepository.name);
    lectureDetailRepositoryMock = module.get(LectureDetailRepository.name);
    lectureMapperMock = module.get(LectureMapper);
    lectureDetailMapperMock = module.get(LectureDetailMapper);
  });

  describe("강의 목록 조회 실행", () => {
    it("강의는 존재하지만 강의 상세 일정이 존재하지 않을 때 강의 상세 일정에서 빈 배열을 반환해야 한다", async () => {
      // given
      const mockLectureEntities = [
        { id: 1, name: "테스트 강의" } as LectureEntity,
      ];
      const mockLecture = new Lecture(1, "테스트 강의");
      const mockLectureDto: LectureDto = {
        id: 1,
        name: "테스트 강의",
        lectureDetails: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      lectureRepositoryMock.findAll.mockResolvedValue(mockLectureEntities);
      lectureDetailRepositoryMock.findByLectureId.mockResolvedValue([]);
      lectureMapperMock.toDomainFromEntity.mockReturnValue(mockLecture);
      lectureMapperMock.toDtoFromDomain.mockReturnValue(mockLectureDto);

      // when
      const result = await browseLecturesUseCase.execute();

      // then
      expect(result).toEqual([mockLectureDto]);
      expect(lectureRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      expect(lectureDetailRepositoryMock.findByLectureId).toHaveBeenCalledWith(
        1
      );
      expect(lectureMapperMock.toDomainFromEntity).toHaveBeenCalledWith(
        mockLectureEntities[0]
      );
      expect(lectureMapperMock.toDtoFromDomain).toHaveBeenCalledWith(
        mockLecture,
        []
      );
    });

    it("강의가 존재할 때 LectureDto 배열을 반환해야 한다", async () => {
      // given
      const mockLectureEntities = [
        { id: 1, name: "테스트 강의" } as LectureEntity,
      ];
      const mockLectureDetailEntities = [
        {
          id: 1,
          lectureId: 1,
          enrollAt: new Date(),
          capacity: 10,
          currentEnrollment: 5,
        } as LectureDetailEntity,
      ];
      const mockLecture = new Lecture(1, "테스트 강의");
      const mockLectureDetail = new LectureDetail(1, 1, new Date(), 10, 5);
      const mockLectureDto: LectureDto = {
        id: 1,
        name: "테스트 강의",
        lectureDetails: [
          {
            id: 1,
            enrollAt: new Date(),
            capacity: 10,
            currentEnrollment: 5,
          } as LectureDetailDto,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      lectureRepositoryMock.findAll.mockResolvedValue(mockLectureEntities);
      lectureDetailRepositoryMock.findByLectureId.mockResolvedValue(
        mockLectureDetailEntities
      );
      lectureMapperMock.toDomainFromEntity.mockReturnValue(mockLecture);
      lectureDetailMapperMock.toDomainFromEntity.mockReturnValue(
        mockLectureDetail
      );
      lectureMapperMock.toDtoFromDomain.mockReturnValue(mockLectureDto);

      // when
      const result = await browseLecturesUseCase.execute();

      // then
      expect(result).toEqual([mockLectureDto]);
      expect(lectureRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      expect(lectureDetailRepositoryMock.findByLectureId).toHaveBeenCalledWith(
        1
      );
      expect(lectureMapperMock.toDomainFromEntity).toHaveBeenCalledWith(
        mockLectureEntities[0]
      );
      expect(lectureDetailMapperMock.toDomainFromEntity).toHaveBeenCalledWith(
        mockLectureDetailEntities[0]
      );
      expect(lectureMapperMock.toDtoFromDomain).toHaveBeenCalledWith(
        mockLecture,
        [mockLectureDetail]
      );
    });

    it("강의가 존재하지 않을 때 빈 배열을 반환해야 한다", async () => {
      // given
      lectureRepositoryMock.findAll.mockResolvedValue([]);
      lectureDetailRepositoryMock.findByLectureId.mockResolvedValue([]);

      // when
      const result = await browseLecturesUseCase.execute();

      // then
      expect(result).toEqual([]);
      expect(lectureRepositoryMock.findAll).toHaveBeenCalledTimes(1);
      expect(
        lectureDetailRepositoryMock.findByLectureId
      ).not.toHaveBeenCalled();
    });
  });
});
