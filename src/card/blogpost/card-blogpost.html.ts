import { html } from "lit";
import {
  BasicBlogmeta,
  type BasicBlogmetaArgs,
} from "../../basic/blogmeta/basic-blogmeta.html";

export type CardBlogpostArgs = BasicBlogmetaArgs & {
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
    ${BasicBlogmeta(blogmetaArgs)}
    <p itemprop="description">${excerpt}</p>
  </card-blogpost>
`;
