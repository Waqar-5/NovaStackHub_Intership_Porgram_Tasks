import { ApiError } from "../utils/apiResponse.js";

/**
 * Usage: router.post('/', validate(registerSchema), controller)
 * `schema` is a zod object shaped like { body?, params?, query? }.
 * Replaces req.body/params/query with the parsed (and coerced) result.
 */
export function validate(schema) {
  return function validator(req, res, next) {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      throw new ApiError(422, "Validation failed", result.error.flatten().fieldErrors);
    }

    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;

    next();
  };
}
