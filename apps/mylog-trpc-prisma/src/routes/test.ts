import { publicProcedure, router } from "../server/trpc";
import prisma from "../server";
import z from "zod";
import jwt from "jsonwebtoken";
import { getUserByPswd } from "@prisma/client/sql";

const TestRouter = router({
  hello: publicProcedure.query(async () => {
    return "Hello, world!";
  }),
  test1: publicProcedure.query(async () => {
    
  }),
});

export default TestRouter;
