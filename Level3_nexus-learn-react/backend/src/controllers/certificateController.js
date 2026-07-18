import Certificate from "../models/Certificate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiSuccess, ApiError } from "../utils/apiResponse.js";

export const myCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id })
    .populate("course", "title slug thumbnailUrl")
    .sort({ issuedAt: -1 });

  return apiSuccess(res, { message: "Certificates fetched.", data: { certificates } });
});

// Public — lets anyone verify a certificate's authenticity from its ID,
// e.g. an employer checking a candidate's claim.
export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({
    certificateId: req.params.certificateId,
  })
    .populate("student", "name")
    .populate("course", "title");

  if (!certificate) throw new ApiError(404, "No certificate found with that ID");

  return apiSuccess(res, { message: "Certificate verified.", data: { certificate } });
});
