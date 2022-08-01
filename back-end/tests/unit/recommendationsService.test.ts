import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { jest } from "@jest/globals";
import { generateNewRecommendationBody } from "../factories/recommendationsFactory.js";

describe("insert", () => {
  it("should call recommendationRepository.create once", async () => {
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => null);

    await recommendationService.insert(generateNewRecommendationBody());
    expect(recommendationRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if recommendation name already exists", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => generateNewRecommendationBody());

    await expect(
      recommendationService.insert(generateNewRecommendationBody())
    ).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });
});

describe("upvote", () => {
  it("should call recommendationRepository.updateScore once", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => generateNewRecommendationBody());
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => null);

    await recommendationService.upvote(1);
    expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if recommendation does not exist", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => null);

    await expect(recommendationService.upvote(1)).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("downvote", () => {
  it("should call recommendationRepository.updateScore", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => generateNewRecommendationBody());
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { score: 0 };
      });

    await recommendationService.downvote(1);
    expect(recommendationRepository.updateScore).toHaveBeenCalled;
  });

  it("should throw an error if recommendation does not exist", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => null);

    await expect(recommendationService.downvote(1)).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });

  it("should remove recommendation if score is below -5", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => generateNewRecommendationBody());
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { score: -5 };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => null);

    await recommendationService.downvote(1);
    expect(recommendationRepository.remove).toHaveBeenCalled;
  });
});

describe("random", () => {
  it("should call recommendationRepository.findAll once", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => [{ name: "test" }]);

    await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenCalledTimes(1);
  });
  it("should throw an error if there are no recommendations", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => []);

    await expect(recommendationService.getRandom()).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("get", () => {
  it("should call recommendationsRepository.findAll", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [];
      });
    await recommendationService.get();
    expect(recommendationRepository.findAll).toHaveBeenCalled;
  });
});

describe("getTop", () => {
  it("should call recommendationRepository.getAmountByScore", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return [];
      });
    await recommendationService.getTop(2);
    expect(recommendationRepository.getAmountByScore).toHaveBeenCalled;
  });
});

describe("getById", () => {
  it("should call recommendationRepository.find", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { name: "test" };
      });
    await recommendationService.getById(1);
    expect(recommendationRepository.find).toHaveBeenCalled;
  });

  it("should throw an error if recommendation does not exist", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => null);

    await expect(recommendationService.getById(1)).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});
