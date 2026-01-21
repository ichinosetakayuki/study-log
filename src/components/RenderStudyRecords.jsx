import { TrashIcon } from "./icons/TrashIcon";

export const RenderStudyRecords = (props) => {
  const { studyRecords, onClickDelete } = props;
  return (
    <ul>
      {studyRecords.map((record) => {
        return (
          <li key={record.id} className="study-record">
             <span>
              {record.title} {record.time}時間
            </span>
            <button aria-label="削除" onClick={() => onClickDelete(record.id)}>
              <TrashIcon size={16} />
            </button>
          </li>
        );
      })}
    </ul>
  );
};
