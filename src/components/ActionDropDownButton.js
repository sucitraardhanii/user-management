"use client";

import { useState } from "react";
import { Menu, Button, Modal } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import ModalCekNippos from "./ModalCekNippos";


export default function ActionDropDownButton({
  actions = [],
  buttonLabel = "Aksi Lainnya",
  icon = <IconDotsVertical size={16} />,
  buttonProps = {},
}) {
  const [modalIndex, setModalIndex] = useState(null);

  const handleModalSubmit = async (nippos) => {
    const action = actions[modalIndex];
    if (action?.onSubmitNippos) {
      await action.onSubmitNippos(nippos);
    }
    setModalIndex(null);
  };

  const handleClick = (action, index) => {
    if (action.type === "modal-nippos") {
      setModalIndex(index);
    } else if (action.type === "modal") {
      action.onClick?.();
    } else if (action.type === "confirm-delete") {
      if (confirm("Apakah kamu yakin ingin menghapus data ini?")) {
        action.onClick?.();
      }
    } else if (action.type === "link") {
      window.location.href = action.href;
    } else {
      action.onClick?.();
    }
  };

  return (
    <>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Button
            leftSection={icon}
            {...buttonProps} // <- semua custom style masuk di sini
          >
            {buttonLabel}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {actions.map((action, index) => (
            <Menu.Item
              key={index}
              leftSection={action.icon}
              color={action.color}
              onClick={() => handleClick(action, index)}
            >
              {action.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      {modalIndex !== null && actions[modalIndex]?.type === "modal-nippos" && (
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
