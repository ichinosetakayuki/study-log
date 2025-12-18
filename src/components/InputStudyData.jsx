export const InputStudyData = (props) => {
  const {title, time, onChangeTitle, onChangeTime} = props;
  return (
    <div>
      <div>
        <label htmlFor="title">学習内容</label>
        <input
          type="text"
          placeholder="学習内容を入力"
          id="title"
          value={title}
          onChange={onChangeTitle}
        />
      </div>
      <div>
        <label htmlFor="time">学習時間</label>
        <input type="number" id="time" value={time} onChange={onChangeTime} />
      </div>

    </div>
  );
};
