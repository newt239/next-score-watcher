import { Button, Modal } from "semantic-ui-react";

type WinModalProps = {
  onClose: () => void;
  winTroughPeople: [string, string][];
};
const WinModal: React.FC<WinModalProps> = ({ onClose, winTroughPeople }) => {
  return (
    <Modal open={winTroughPeople.length !== 0} onClose={onClose}>
      <Modal.Header>Congratulations!</Modal.Header>
      <Modal.Content>
        {winTroughPeople.map((player) => (
          <div key={player[0]} style={{ display: "flex" }}>
            <div>{player[1]}</div>: <div>{player[0]}</div>
          </div>
        ))}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>閉じる</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default WinModal;
