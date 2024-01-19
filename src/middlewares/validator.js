import { body, param } from "express-validator";
import { checkAllowedFields, titleCase, verifyEmail, verifyPhone } from "../helpers/validation";

export const signup_validator = [
    body('name')
        .exists()
        .withMessage("Name is required")
        .isLength({ min: 5})
        .withMessage("Name must be atleast 5 characters")
        .trim()
        .customSanitizer(titleCase),
    body('phone')
        .exists()
        .withMessage("Phone Number is required")
        .notEmpty()
        .withMessage("Phone Number cannot be empty")
        .isLength({ min: 11 })
        .withMessage("Phone Number must be at least 11 digits")
        .custom(verifyPhone),
    body('email')
        .exists()
        .withMessage("Email is required")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Email is not valid")
        .custom(verifyEmail)
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage("Password is required")
        .isLength({ min: 7})
        .withMessage("Password must not be less than 7 characters"),
    body()
        .custom(body => checkAllowedFields(body, ['name', 'phone', 'email', 'picture', 'status', 'password']))  
]

export const login_validator = [
    body('email')
        .exists()
        .withMessage("Email is required")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Email is not valid")
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage("Password is required")
        .isLength({ min: 7})
        .withMessage("Password must not be less than 7 characters"),
    body()
        .custom(body => checkAllowedFields(body, ['email', 'password']))
]

export const get_login_status_validator = [
    param('token')
        .exists()
        .withMessage("Token is required")
        .notEmpty()
        .withMessage("Token cannot be empty")
]

export const create_open_conversation_validator = [
    body('receiver_id')
        .exists()
        .withMessage("Receiver Id is required")
        .notEmpty()
        .withMessage("Receiver Id cannot be empty"),
    body('isGroup')
        .exists()
        .withMessage("Group Type is required")
        .notEmpty()
        .withMessage("Group Type cannot be empty"),
    body()
        .custom(body => checkAllowedFields(body, ['receiver_id', 'isGroup']))
]

export const create_group_validator = [
    body('name')
        .exists()
        .withMessage("Group Name is required")
        .notEmpty()
        .withMessage("Group Name cannot be empty")
        .customSanitizer(titleCase),
    body('users')
        .exists()
        .withMessage("Add more users to the group")
        .notEmpty()
        .withMessage("Add more users to the group"),
    body()
        .custom(body => checkAllowedFields(body, ['name', 'users']))
]

export  const send_message_validator = [
    body('message')
        .optional()
        .trim(),
    body('convo_id')
        .exists()
        .withMessage("Conversation Id is required")
        .notEmpty()
        .withMessage("Conversation Id cannot be empty"),
    body('files')
        .optional(),
    body()
        .custom(body => checkAllowedFields(body, ['message', 'convo_id', 'files']))   
]

export const get_messages_validator = [
    param('convo_id')
        .exists()
        .withMessage("Conversation Id is required")
        .notEmpty()
        .withMessage("Conversation Id cannot be empty")
]

export const delete_message_validator = [
    body('message')
        .optional()
        .trim(),
    body()
        .custom(body => checkAllowedFields(body, ['message'])),
    param('message_id')
        .exists()
        .withMessage("Message ID is required")
        .notEmpty()
        .withMessage("Message ID cannot be empty")
]

export const edit_message_validator = [
    body('message')
        .optional()
        .trim(),
    body()
        .custom(body => checkAllowedFields(body, ['message'])),
    param('message_id')
        .exists()
        .withMessage("Message Id is required")
        .notEmpty()
        .withMessage("Message Id cannot be empty")
]

export const handle_reaction_validator = [
    body('emoji')
        .exists()
        .withMessage("Emoji is required")
        .notEmpty()
        .withMessage("Emoji cannot be empty"),
    body()
        .custom(body => checkAllowedFields(body, ['emoji'])),
    param('message_id')
        .exists()
        .withMessage("Message Id is required")
        .notEmpty()
        .withMessage("Message Id cannot be empty")
]

export const reply_message_validator = [
    body('message')
        .optional()
        .trim(),
    body('convo_id')
        .exists()
        .withMessage("Conversation Id is required")
        .notEmpty()
        .withMessage("Conversation Id cannot be empty"),
    body('files')
        .optional(),
    body()
        .custom(body => checkAllowedFields(body, ['message', 'convo_id', 'files'])),
    param('reply_id')
        .exists()
        .withMessage("Reply Id is required")
        .notEmpty()
        .withMessage("Reply Id cannot be empty")
]