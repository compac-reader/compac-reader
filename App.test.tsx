import React from "react";
import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import { View } from "react-native";
import App from "./App";
import { useMigration } from "./hooks/useMigration";
import { FAB } from "react-native-elements";

jest.useFakeTimers();

jest.mock("./hooks/useMigration");
const mockUseMigration = useMigration as jest.MockedFunction<
  typeof useMigration
>;

// This test fails if FAB exists.
jest.mock("react-native-elements");
const mockFAB = FAB as jest.MockedFunction<typeof FAB>;
mockFAB.mockReturnValue(<View />);

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
