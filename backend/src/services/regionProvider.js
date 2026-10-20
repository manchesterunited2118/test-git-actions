async function lookupNumberRegion(phone) {
  return {
    phone,
    country: phone.startsWith("+91") ? "IN" : null,
    city: null,
    state: null,
    source: "unknown",
    confidence: "not-available",
  };
}

export default lookupNumberRegion
