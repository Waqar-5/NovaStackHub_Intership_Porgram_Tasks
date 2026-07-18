import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { startConversationSchema, conversationIdParamSchema } from "../validators/chatValidators.js";
import * as conversationController from "../controllers/conversationController.js";
import * as messageController from "../controllers/messageController.js";

const router = Router();

router.use(requireAuth);

router.get("/contacts", conversationController.listContacts);
router.get("/", conversationController.myConversations);
router.post("/", validate(startConversationSchema), conversationController.startConversation);
router.get(
  "/:conversationId/messages",
  validate(conversationIdParamSchema),
  messageController.getMessages
);
router.post(
  "/:conversationId/read",
  validate(conversationIdParamSchema),
  messageController.markConversationRead
);

export default router;
