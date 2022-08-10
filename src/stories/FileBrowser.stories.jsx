import React from "react";

import App from "../App";

const TestComponent = () => {
  return (
    <section>
      <h1>THi si s testetsetset</h1>;
    </section>
  );
};

export default {
  title: "Example/FileBrowser",
  component: App,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
};

const Template = args => <App {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  //   primary: true,
  //   label: "Button",
};
