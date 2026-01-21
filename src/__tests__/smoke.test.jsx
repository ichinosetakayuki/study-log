import { render, screen } from "@testing-library/react";

test("Jest + RTL が動く", () => {
  render(<h1>Hello Test</h1>);
  expect(screen.getByText("Hello Test")).toBeInTheDocument();
});
