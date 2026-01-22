import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// alertの無効化(App内でalertを呼んでいるため)
beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});
afterEach(() => {
  window.alert.mockRestore();
  jest.clearAllMocks(); // すべてのモックの呼び出し履歴（回数）をリセット
});

// supabaseClient を丸ごとっモック
jest.mock("../supabaseClient", () => {
  const qb = {
    // select("*").order(...)
    select: jest.fn(() => qb),
    order: jest.fn(),

    // insert(...).select().single()
    insert: jest.fn(() => qb),
    single: jest.fn(),

    // delete().eq(...)
    delete: jest.fn(() => qb),
    eq: jest.fn(),
  };

  return {
    supabase: {
      from: jest.fn(() => qb),
      __qb: qb,
    },
  };
});

import { supabase } from "../supabaseClient";

async function waitInitialLoadToFinish() {
  // queryBy... を使い、その要素が画面から消えるまで待機する
  await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
}

test("タイトルが表示されていること", async () => {
  // 初期表示の取得を空で返す
  supabase.__qb.order.mockResolvedValueOnce({ data: [], error: null });

  render(<App />);

  await waitInitialLoadToFinish();

  const title = await screen.findByRole("heading", { name: "学習記録アプリ" });
  expect(title).toBeInTheDocument();
});

test("フォームに入力して登録ボタンを押すと新たに記録が追加されている", async () => {
  const user = userEvent.setup();

  // 初期取得：空
  supabase.__qb.order.mockResolvedValueOnce({ data: [], error: null });
  // insert 後に返ってくる1件
  supabase.__qb.single.mockResolvedValueOnce({
    data: { id: 1, title: "React", time: 2 },
    error: null,
  });

  render(<App />);

  await waitInitialLoadToFinish();

  await user.type(screen.getByLabelText("学習内容"), "React");

  // number入力は環境によって挙動が違うので、clearしてから type すると安定
  const timeInput = screen.getByLabelText("学習時間");
  await user.clear(timeInput);
  await user.type(timeInput, "2");

  await user.click(screen.getByRole("button", { name: "登録" }));

  expect(await screen.findByText(/React\s+2時間/)).toBeInTheDocument();
});

test("削除ボタンを押すと学習記録が削除される", async () => {
  const user = userEvent.setup();

  supabase.__qb.order.mockResolvedValueOnce({
    data: [{ id: 1, title: "React", time: 2 }],
    error: null,
  });
  supabase.__qb.eq.mockResolvedValueOnce({ error: null });

  render(<App />);

  await waitInitialLoadToFinish();

  const rows = await screen.findAllByRole("listitem");

  const targetRow = rows.find((row) => row.textContent.includes("React 2時間"));

  expect(targetRow).toBeTruthy();

  await user.click(within(targetRow).getByRole("button", { name: "削除" }));
});

test("入力をしないで登録を押すとエラーが表示される", async() => {
  const user = userEvent.setup();

  supabase.__qb.order.mockResolvedValueOnce({ data: [], error: null });

  render(<App />);

  await waitInitialLoadToFinish();

  await user.click(screen.getByRole("button", { name: "登録" }));

  expect(screen.getByText("学習内容と学習時間は必須入力です。")).toBeInTheDocument();
  expect(supabase.__qb.insert).not.toHaveBeenCalled();

})