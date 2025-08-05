import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

const factory = createFactory();

const indexHandler = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid("param");

    console.log(id);

    return c.json({ status: "success", data: "test" } as const, 200);
  }
);

export default indexHandler;
