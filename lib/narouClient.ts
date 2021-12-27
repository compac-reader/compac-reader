import * as httpClient from "./httpClient";
import cheerio from "cheerio";

const publisherType = "narou";
const NCODE_URL_BASE = "https://ncode.syosetu.com";

export type ListedEpisode =
  | {
      id: string;
      storyId: string;
      type: "episode";
      episodeId: string;
      title: string;
      publishedAt: number;
      revisedAt: number;
      index: number;
    }
  | {
      id: string;
      storyId: string;
      type: "header";
      title: string;
      index: number;
    };

export type Story = {
  id: string;
  publisherType: "narou";
  publisherCode: string;
  title: string;
  icon: string;
  authorName: string;
  description: string;
  episodes: ListedEpisode[];
};

export type ReadableEpisode = {
  id: string;
  publisherType: "narou";
  publisherCode: string;
  episodeId: string;
  title: string;
  body: string;
};

/**
 * load from `http://ncode.syosetu.com/:id/`
 * @param code
 */
export async function fetchStory(publisherCode: string): Promise<Story> {
  const url = `${NCODE_URL_BASE}/${publisherCode}/`;

  const $ = await httpClient.fetchHTML(url);
  const storyId = `${publisherType}__${publisherCode}`;
  const title = $(".novel_title").text();
  const authorName = $(".novel_writername a").text();
  const description = $("#novel_ex").text();
  const episodes: ListedEpisode[] = $(".chapter_title, .novel_sublist2")
    .map((index, element) => {
      const el = $(element);
      const type = el.attr("class") === "chapter_title" ? "header" : "episode";
      if (type === "header") {
        const header: ListedEpisode = {
          id: `${storyId}__header-${index}`,
          storyId,
          type,
          title: el.text(),
          index,
        };
        return header;
      } else {
        const episodeId = el
          .find(".subtitle a")
          .attr("href")
          ?.replace(`/${publisherCode}/`, "")
          .replace("/", "")!;
        const luContents = el.find(".long_update").contents();
        const publishedAt = parseDateFromString(luContents.first().text());
        const revisedAt =
          luContents.length > 1
            ? parseDateFromString($(luContents[1]).attr("title")!)
            : publishedAt;
        const episode: ListedEpisode = {
          id: `${storyId}__${episodeId}`,
          storyId,
          type,
          episodeId,
          title: el.find(".subtitle").text().trim(),
          publishedAt,
          revisedAt,
          index,
        };
        return episode;
      }
    })
    .get();
  // 短編
  (() => {
    if ($("#novel_honbun").length > 0) {
      const publishedAt = new Date(
        $('meta[name="WWWC"]').attr("content")!
      ).getTime();
      episodes.push({
        id: `${storyId}__0`,
        storyId,
        type: "episode",
        episodeId: "",
        title,
        publishedAt: publishedAt,
        revisedAt: publishedAt,
        index: 0,
      });
    }
  })();
  return {
    id: storyId,
    publisherType,
    publisherCode,
    title,
    authorName,
    description,
    icon: "",
    episodes,
  };
}

/**
 * load from `http://ncode.syosetu.com/:id/:episodeId/`
 * @param publisherCode
 * @param episodeId
 */
export async function fetchEpisode(
  publisherCode: string,
  episodeId: string
): Promise<ReadableEpisode> {
  const url = (() => {
    if (episodeId !== "") {
      return `${NCODE_URL_BASE}/${publisherCode}/${episodeId}/`;
    } else {
      return `${NCODE_URL_BASE}/${publisherCode}/`;
    }
  })();

  const $ = await httpClient.fetchHTML(url);
  const title = $(".novel_subtitle").text() || $(".novel_title").text();
  const rawBody = [$("#novel_p"), $("#novel_honbun"), $("#novel_a")]
    .map((el) => {
      el.find("a").replaceWith((_, tag) => $(tag).html()!);
      return el.html();
    })
    .filter((n) => !!n)
    .join('<hr class="border-comment">');

  const body = await (async () => {
    // Embed images in Base64
    const $ = cheerio.load(rawBody);
    const images = $("img");
    const base64Urls = await Promise.all(
      images.map((_, image) => {
        const src = $(image).attr("src")!;
        const url = src.startsWith("http") ? src : `https:${src}`;
        return httpClient.fetchBlobBase64(url).then((base64) => {
          return `data:image/png;base64,${base64}`;
        });
      })
    );
    $("img").attr("src", (i) => base64Urls[i]);
    return $.html();
  })();

  return {
    id: `${publisherType}__${publisherCode}__${episodeId || "0"}`,
    publisherType,
    publisherCode,
    episodeId,
    title,
    body,
  };
}

function parseDateFromString(str: string) {
  const m = str.match(/(\d+)(?:年|\/)\s*(\d+)(?:月|\/)\s*(\d+)日?/);
  if (!m) return 0;
  return Date.parse(`${m[1]}-${m[2]}-${m[3]}T00:00:00+09:00`);
}
