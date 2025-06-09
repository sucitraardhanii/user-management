// components/DynamicForm.js
"use client";

import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function DynamicForm({ fields, onSubmit, loading = false }) {
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const form = useForm({ initialValues });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Flex gap="md" wrap="wrap" mb="md">
        {fields.map((field) => (
          <TextInput
            key={field.name}
            label={field.label}
            placeholder={field.placeholder || field.label}
            {...form.getInputProps(field.name)}
            style={{ flexGrow: 1, minWidth: "200px" }}
          />
        ))}
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </Flex>
    </form>
  );
}
