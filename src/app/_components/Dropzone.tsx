"use client";

import { Group, Text, rem } from "@mantine/core";
import { DropzoneProps, Dropzone as MantineDropzone } from "@mantine/dropzone";
import { Photo, Upload, X } from "tabler-icons-react";

const Dropzone = (props: Partial<DropzoneProps>) => {
  return (
    <MantineDropzone
      onDrop={(files) => console.log("accepted files", files)}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={5 * 1024 ** 2}
      accept={["text/csv"]}
      {...props}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <MantineDropzone.Accept>
          <Upload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
          />
        </MantineDropzone.Accept>
        <MantineDropzone.Reject>
          <X
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
          />
        </MantineDropzone.Reject>
        <MantineDropzone.Idle>
          <Photo
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
          />
        </MantineDropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </MantineDropzone>
  );
};

export default Dropzone;
