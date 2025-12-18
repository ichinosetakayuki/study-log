import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { InputStudyData } from "./components/InputStudyData";
import { RenderStudyLogs } from "./components/renderStudyLogs";

function App() {
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const savedStudyLogs = JSON.parse(localStorage.getItem("savedStudyLogs"));
  const [studyLogs, setStudyLogs] = useState(savedStudyLogs);
  const [total, setTotal] = useState(() => {
    const initTotal = savedStudyLogs.reduce((accumulator,currentValue) => 
      Number(accumulator) + Number(currentValue.time), 0,
    );
    return initTotal;
  });

  const onChangeTitle = (event) => setTitle(event.target.value);
  const onChangeTime = (event) => setTime(event.target.value);

  const onClickAdd = () => {
    if(title === "" || time === "") {
      setErrorMessage("学習内容と学習時間は必須入力です。");
      return;
    }
    if(!Number(time) || Number(time)<0) {
      setErrorMessage("学習時間は0より大きい数字を入力してください。");
      return;
    }
    setErrorMessage("");
    const studyLog = {title, time};
    const newStudyLogs = [...studyLogs, studyLog];
    setStudyLogs(newStudyLogs);
    setTitle("");
    setTime("");
    localStorage.setItem("savedStudyLogs",JSON.stringify(newStudyLogs));
    console.log(newStudyLogs);
    const newTotal = Number(total) + Number(time);
    setTotal(newTotal);
  }

  return (
    <>
      <h1>学習記録アプリ</h1>
      <InputStudyData  title={title} time={time} onChangeTitle={onChangeTitle} onChangeTime={onChangeTime} />
      <p style={{ color: "red" }}>
        {errorMessage}
      </p>
      <div className="input-content">
        入力されている学習内容：<span>{title}</span>
      </div>
      <div className="input-content">
        入力されている時間：<span>{time}</span>
      </div>
      <RenderStudyLogs studyLogs={studyLogs} />
      <div>
        <button onClick={onClickAdd}>登録</button>
      </div>
      <p>
        合計時間：<span>{total}</span> / 1000 (h)
      </p>
    </>
  );
}

export default App;
