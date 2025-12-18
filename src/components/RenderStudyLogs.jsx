export const RenderStudyLogs = (props) => {
  const { studyLogs } = props;
  return (
    <ul id="recordedArea">
      {studyLogs.map((log, index) => {
        return (
          <li key={index} className="study-record">
            {log.title} {log.time}時間
          </li>
        );
      })}
    </ul>
  );
};
