import { Menu, Button, Text, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconChevronDown } from "@tabler/icons-react";

export default function ActionDropDownButton({
  buttonLabel = "Actions",
  buttonProps = {},
  actions = [],
  icon = <IconChevronDown size={14} />, // icon dropdown
}) {
  const handleActionClick = (action) => {
    if (action.type === "confirm-delete") {
      modals.openConfirmModal({
        title: action.confirmTitle || "Konfirmasi Hapus",
        centered: true,
        size: "sm",
        overlayProps: { blur: 2, opacity: 0.1 },
        children: (
          <Text size="sm">
            {action.confirmMessage || (
              <>Yakin ingin menghapus <b>{action.name || "data ini"}</b>?</>
            )}
          </Text>
        ),
        labels: { confirm: action.confirmLabel || "Hapus", cancel: "Batal" },
        confirmProps: { color: action.color || "red" },
        onConfirm: action.onClick,
      });
    } else if (action.type === "modal-nippos") {
      modals.openContextModal({
        modal: "nippos-input",
        title: action.modalTitle || "Input Nippos",
        innerProps: {
          onSubmit: action.onSubmitNippos,
        },
      });
    } else {
      action.onClick();
    }
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button {...buttonProps}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {icon}
            {buttonLabel}
          </span>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {actions.map((action, index) => (
          <Menu.Item
            key={index}
            color={action.color}
            onClick={() => handleActionClick(action)}
          >
            <Group spacing={6}>
              {action.icon}
              <span>{action.label}</span>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
