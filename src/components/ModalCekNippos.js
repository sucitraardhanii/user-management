"use client";

import { useState } from "react";
import { Modal, TextInput, Button, Group } from "@mantine/core";

export default function ModalCekNippos({ opened, onClose, onSubmit, title }) {
  const [nippos, setNippos] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nippos) return;
    setLoading(true);
    await onSubmit(nippos);
    setLoading(false);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <TextInput
        label="NIPPOS"
        placeholder="Masukkan NIPPOS"
        value={nippos}
        onChange={(e) => setNippos(e.target.value)}
        required
      />
      <Group justify="end" mt="md">
        <Button onClick={handleSubmit} disabled={loading}>Submit</Button>
      </Group>
    </Modal>
  );
}
