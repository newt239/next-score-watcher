"use client";

import { Group, Text, rem } from "@mantine/core";
import { DropzoneProps, Dropzone as MantineDropzone } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

import classes from "./Dropzone.module.css";

const Dropzone = (props: Partial<DropzoneProps>) => {
  return (
    <MantineDropzone
      onDrop={(files) => console.log("accepted files", files)}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={5 * 1024 ** 2}
      accept={["text/csv"]}
      {...props}
    >
      <Group className={classes.dropzone_inner}>
        <MantineDropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
          />
        </MantineDropzone.Accept>
        <MantineDropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
          />
        </MantineDropzone.Reject>
        <MantineDropzone.Idle>
          <IconPhoto
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
          />
        </MantineDropzone.Idle>

        <div>
          <Text size="xl" inline>
            このエリアにCSVファイルをドロップ
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            またはクリックしてCSVファイルを選択
          </Text>
        </div>
      </Group>
    </MantineDropzone>
  );
};

export default Dropzone;
