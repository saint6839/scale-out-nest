import { Test, TestingModule } from "@nestjs/testing";
import { IUserRepository } from "src/user/domain/interface/repository/user.repository.interface";
import { UserValidatorService } from "src/user/infrastructure/service/user.validator.service";

describe("UserValidatorService", () => {
  let userValidatorService: UserValidatorService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserValidatorService,
        {
          provide: "IUserRepository",
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    userValidatorService =
      module.get<UserValidatorService>(UserValidatorService);
    userRepositoryMock = module.get("IUserRepository");
  });

  describe("validateUserExists", () => {
    it("사용자가 존재할 경우 예외를 발생시키지 않아야 한다", async () => {
      // given
      const userId = 1;
      userRepositoryMock.findById.mockResolvedValue({
        id: userId,
        name: "테스트 사용자",
      });

      // when & then
      await expect(
        userValidatorService.validateUserExists(userId)
      ).resolves.not.toThrow();
    });

    it("사용자가 존재하지 않을 경우 예외를 발생시켜야 한다", async () => {
      // given
      const userId = 1;
      userRepositoryMock.findById.mockResolvedValue(null);

      // when & then
      await expect(
        userValidatorService.validateUserExists(userId)
      ).rejects.toThrow("사용자가 존재하지 않습니다.");
    });
  });
});
