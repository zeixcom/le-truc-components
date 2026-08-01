import { html } from "lit";
import {
  CardBlogmeta,
  type CardBlogmetaArgs,
} from "../blogmeta/card-blogmeta.html";

export type CardBlogpostArgs = CardBlogmetaArgs & {
  title: string;
  href: string;
  excerpt: string;
};

export const CardBlogpost = ({
  title,
  href,
  excerpt,
  ...blogmetaArgs
}: CardBlogpostArgs) => html`
  <card-blogpost itemscope itemtype="https://schema.org/BlogPosting">
    <h2>
      <a href=${href} itemprop="url"
        ><span itemprop="headline">${title}</span></a
      >
    </h2>
    ${CardBlogmeta(blogmetaArgs)}
    <p itemprop="description">${excerpt}</p>
  </card-blogpost>
`;
