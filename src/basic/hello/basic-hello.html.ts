import { html } from "lit";

export type BasicHelloArgs = {
  subject: string;
};

export const Hello = ({ subject }: BasicHelloArgs) => html`
  <basic-hello>
    <label for="hello-subject">Your name</label><br />
    <input
      id="hello-subject"
      name="subject"
      type="text"
      autocomplete="given-name"
    />
    <p>Hello, <output for="hello-subject">${subject}</output>!</p>
  </basic-hello>
`;
