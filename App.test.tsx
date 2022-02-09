import React from "react";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";

import App from "./App";
import { useMigration } from "./hooks/useMigration";

jest.useFakeTimers();
jest.mock("./hooks/useMigration");

const mockUseMigration = useMigration as jest.MockedFunction<
  typeof useMigration
>;

describe("<App />", () => {
  it("no child when migration is on", async () => {
    mockUseMigration.mockReturnValue({ isMigrating: true });
    const tree = renderer.create(<App />).toJSON() as ReactTestRendererJSON;
    expect(tree.children).toBeNull();
  });

  it("has 1 child", async () => {
    mockUseMigration.mockReturnValue({ isMigrating: false });
    const tree = renderer.create(<App />).toJSON() as ReactTestRendererJSON;
    expect(tree.children?.length).toBe(1);
  });
});
