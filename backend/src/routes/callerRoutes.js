import { Router } from "express";
import parsePhoneNumber from "libphonenumber-js/max";

import Caller from "../models/Caller.js";
import  lookupNumberRegion  from "../services/regionProvider.js";

const router = Router();

router.get("/:phone", async (req, res, next) => {
  try {
    const rawPhone = req.params.phone;

    // For this first milestone, accept international-format numbers
    // such as +919876543210.
    if (!rawPhone.startsWith("+")) {
      return res.status(400).json({
        success: false,
        message: "Use international format, for example +919876543210",
      });
    }

    const parsed = parsePhoneNumber(rawPhone);

    if (!parsed || !parsed.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    const phone = parsed.number;

    // Exact lookup, not a guessed match on the last digits.
    const caller = await Caller.findOne({ phone }).lean();

    // Number-region information comes from a separate provider.
    const region = await lookupNumberRegion(phone);

    return res.status(200).json({
      success: true,
      data: {
        phone,
        displayName: caller?.displayName || null,

        numberRegion: caller?.numberRegion?.source &&
          caller.numberRegion.source !== "unknown"
          ? {
              country: caller.numberRegion.country || null,
              city: caller.numberRegion.city || null,
              state: caller.numberRegion.state || null,
              source: caller.numberRegion.source,
              updatedAt: caller.numberRegion.updatedAt || null,
            }
          : region,

        liveLocation: null,
        locationStatus: "not-shared",
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;