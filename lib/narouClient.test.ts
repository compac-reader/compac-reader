import { fetchEpisode, fetchStory } from "./narouClient";
import cheerio from "cheerio";
import * as httpClient from "./httpClient";
import fs from "fs";

jest.mock("./httpClient");

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

mockedHttpClient.fetchHTML.mockImplementation((url, _) => {
  return new Promise((resolved, _) => {
    let path = new URL(url).pathname.substring(1);
    if (path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    const html = fs.readFileSync(`lib/__test__/narou/${path}.htm`).toString();
    resolved(cheerio.load(html));
  });
});

describe("fetchStory", () => {
  it("can parse html", async () => {
    const story = await fetchStory("n8352hj");
    expect(story.id).toBe("narou__n8352hj");
    expect(story.authorName).toBe("kouki_dan");
    expect(story.publisherType).toBe("narou");
    expect(story.publisherCode).toBe("n8352hj");
    expect(story.title).toBe("なろうにある機能を全部試す");
    expect(story.icon).toBe("");
    expect(story.description).toBe("なろうで小説を書くために色々やってみる。");
    expect(story.episodes[0]).toMatchObject({
      id: "narou__n8352hj__header-0",
      index: 0,
      storyId: "narou__n8352hj",
      title: "ここから始める",
      type: "header",
    });
    expect(story.episodes[1]).toMatchObject({
      episodeId: "1",
      id: "narou__n8352hj__1",
      index: 1,
      publishedAt: 1640358000000,
      revisedAt: 1640358000000,
      storyId: "narou__n8352hj",
      title: "小説家を目指すエッセイ",
      type: "episode",
    });
    expect(story.episodes[2]).toMatchObject({
      id: "narou__n8352hj__header-2",
      index: 2,
      storyId: "narou__n8352hj",
      title: "初めての章",
      type: "header",
    });
    expect(story.episodes[3]).toMatchObject({
      episodeId: "2",
      id: "narou__n8352hj__2",
      index: 3,
      publishedAt: 1640358000000,
      revisedAt: 1640358000000,
      storyId: "narou__n8352hj",
      title: "新しい章。新しい朝。",
      type: "episode",
    });
    expect(story.episodes[4]).toMatchObject({
      episodeId: "3",
      id: "narou__n8352hj__3",
      index: 4,
      publishedAt: 1640358000000,
      revisedAt: 1640358000000,
      storyId: "narou__n8352hj",
      title: "文字と絵",
      type: "episode",
    });
    expect(story.episodes[5]).toMatchObject({
      episodeId: "4",
      id: "narou__n8352hj__4",
      index: 5,
      publishedAt: 1640358000000,
      revisedAt: 1640358000000,
      storyId: "narou__n8352hj",
      title: "前書きと後書き。それとルビ",
      type: "episode",
    });
    expect(story.episodes[4]).toMatchObject({});
    expect(story.episodes[4]).toMatchObject({});
  });
});

describe("fetchEpisode", () => {
  it("can parse html", async () => {
    const episode = await fetchEpisode("n8352hj", "1");
    expect(episode.id).toBe("narou__n8352hj__1");
    expect(episode.publisherType).toBe("narou");
    expect(episode.publisherCode).toBe("n8352hj");
    expect(episode.episodeId).toBe("1");
    expect(episode.title).toBe("小説家を目指すエッセイ");
    expect(episode.body).toContain("クリスマス");
  });

  it("can parse html with image", async () => {
    mockedHttpClient.fetchBlobBase64.mockResolvedValue(
      "this_is_a_base64_encoded_image"
    );
    const episode = await fetchEpisode("n8352hj", "3");
    expect(episode.id).toBe("narou__n8352hj__3");
    expect(episode.publisherType).toBe("narou");
    expect(episode.publisherCode).toBe("n8352hj");
    expect(episode.episodeId).toBe("3");
    expect(episode.title).toBe("文字と絵");
    expect(episode.body).toContain("ワクワク");
    expect(episode.body).toContain("this_is_a_base64_encoded_image");
  });
});
