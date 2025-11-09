import React from "react";
import { Modal, Card, Row, Col } from "antd";
import "../styles/BadgePanel.css";

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

interface BadgePanelProps {
  earnedBadges: string[];
  visible: boolean;
  onClose: () => void;
}

const ALL_BADGES: Omit<Badge, "earned">[] = [
  { id: "100Minutes", name: "100 Minutes Focus", description: "Focus for 100 total minutes" },
  { id: "7DayStreak", name: "7-Day Streak", description: "Focus 7 days in a row" },
  { id: "5SessionsDay", name: "5 Sessions in a Day", description: "Complete 5 sessions in one day" },
];

function BadgePanel({ earnedBadges, visible, onClose }: BadgePanelProps) {
  const badges: Badge[] = ALL_BADGES.map((b) => ({
    ...b,
    earned: earnedBadges.includes(b.name),
  }));

  return (
    <Modal title="Achievements" open={visible} onCancel={onClose} footer={null}>
      <Row gutter={[16, 16]}>
        {badges.map((badge) => (
          <Col key={badge.id} xs={24} sm={12} md={8}>
            <Card
              hoverable={badge.earned}
              className={badge.earned ? "earned" : "locked"}
              onClick={() =>
                badge.earned
                  ? Modal.info({
                      title: badge.name,
                      content: <p>{badge.description}</p>,
                      okText: "Close",
                    })
                  : null
              }
            >
              <div style={{ textAlign: "center", fontSize: "1.5rem" }}>🏅</div>
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>{badge.name}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
}

export default BadgePanel;
