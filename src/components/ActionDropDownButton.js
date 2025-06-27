"use client";

import { useState } from "react";
import { Menu, Button } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import ModalCekNippos from "./ModalCekNippos"; // modal input nippos

export default function ActionDropDownButton({ actions = [] }) {
  const [modalIndex, setModalIndex] = useState(null);

  const handleModalSubmit = async (nippos) => {
    const action = actions[modalIndex];
    if (action?.onSubmitNippos) {
      await action.onSubmitNippos(nippos);
    }
    setModalIndex(null);
  };

  return (
    <>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Button
            variant="outline"
            leftSection={<IconDotsVertical size={16} />}
          >
            Aksi
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {actions.map((action, index) => (
            <Menu.Item
              key={index}
              leftSection={action.icon}
              color={action.color}
              onClick={() => {
                if (action.type === "modal") {
                  setModalIndex(index);
                } else {
                  action.onClick?.();
                }
              }}
            >
              {action.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      {/* Modal input NIPPOS jika ada aksi bertipe modal */}
      {modalIndex !== null && (
        <ModalCekNippos
          opened
          title={actions[modalIndex]?.modalTitle || "Input NIPPOS"}
          onClose={() => setModalIndex(null)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
}
