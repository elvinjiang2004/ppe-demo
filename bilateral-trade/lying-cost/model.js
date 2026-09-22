/* Jiang (September 2026), Sections 3-5 and Propositions 4-5.
   Both presets use direct reports and include lying costs in IC diagnostics.
   Analytic best reports and ex-post deviation bounds: see architecture.md. */
(function (global) {
  "use strict";
  var THRESHOLD_FACTOR = 1 - Math.cbrt(0.5);
  function positive(x) { return Math.max(0, x); }
  function validate(value, name) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
      throw new RangeError(name + " must be a finite number in [0,1].");
    }
  }
  function reportTrace(support, kink, bestReport) {
    var types = [support[0], support[1]];
    if (kink > support[0] && kink < support[1]) { types.splice(1, 0, kink); }
    return Object.freeze(types.map(function (type) {
      return Object.freeze([type, bestReport(type)]);
    }));
  }
  function createRule(parameters, id) {
    var gamma = parameters.gamma;
    var epsilon = parameters.epsilon;
    validate(gamma, "gamma");
    validate(epsilon, "epsilon");
    var minimum = id === "minimum-rent";
    var a = 1 - epsilon;
    var b = 2 - epsilon;
    var buyerSupport = Object.freeze([0, 1]);
    var sellerSupport = Object.freeze([a, b]);
    var length = positive(epsilon - gamma);
    var welfare = Math.pow(epsilon, 3) / 6;
    var individualRent = minimum ? Math.pow(length, 3) / 6 : welfare / 2;
    var revenue = minimum ? welfare - 2 * individualRent : 0;
    var threshold = epsilon * THRESHOLD_FACTOR;
    var bic = minimum || gamma >= epsilon / 2;
    var dsicThreshold = epsilon === 0 ? 0 : minimum ? 1 : 0.5;
    var maximumExPostGain = minimum ?
      (1 - gamma) * epsilon - length * length / 2 : positive(0.5 - gamma) * epsilon;
    var maximumInterimGain = minimum ? 0 : Math.pow(positive(epsilon - 2 * gamma), 2) / 12;
    function q(v, c) { return v >= c ? 1 : 0; }
    function buyerAllocation(v) { return positive(v - a); }
    function sellerAllocation(c) { return positive(1 - c); }
    // These are truthful interim utilities; only the first preset minimizes them.
    function buyerRent(v) {
      return minimum ? Math.pow(positive(v - a - gamma), 2) / 2 : Math.pow(buyerAllocation(v), 2) / 4;
    }
    function sellerRent(c) {
      return minimum ? Math.pow(positive(1 - c - gamma), 2) / 2 : Math.pow(sellerAllocation(c), 2) / 4;
    }
    function pB(v, c) { return minimum ? v * q(v, c) - buyerRent(v) : (v + c) * q(v, c) / 2; }
    function pS(v, c) { return minimum ? c * q(v, c) + sellerRent(c) : (v + c) * q(v, c) / 2; }
    function buyerPayoff(v, c) { return minimum ? buyerRent(v) : positive(v - c) / 2; }
    function sellerPayoff(v, c) { return minimum ? sellerRent(c) : positive(v - c) / 2; }
    function buyerPayment(v) { return v * buyerAllocation(v) - buyerRent(v); }
    function sellerPayment(c) { return c * sellerAllocation(c) + sellerRent(c); }
    function buyerDeviation(v, r) {
      return (v - r) * buyerAllocation(r) + buyerRent(r) - gamma * Math.abs(v - r);
    }
    function sellerDeviation(c, s) {
      return (s - c) * sellerAllocation(s) + sellerRent(s) - gamma * Math.abs(c - s);
    }
    function buyerExPostDeviation(v, r, c) {
      return (v - r) * q(r, c) + buyerPayoff(r, c) - gamma * Math.abs(v - r);
    }
    function sellerExPostDeviation(c, s, v) {
      return (s - c) * q(v, s) + sellerPayoff(v, s) - gamma * Math.abs(c - s);
    }
    function buyerBestReport(v) { return minimum ? v : v - positive(v - a - 2 * gamma) / 3; }
    function sellerBestReport(c) { return minimum ? c : c + positive(1 - c - 2 * gamma) / 3; }
    var totals = Object.freeze({
      tradeProbability: epsilon * epsilon / 2,
      welfare: welfare, buyerUtility: individualRent, sellerUtility: individualRent,
      buyerPayment: minimum ? epsilon * epsilon / 2 - Math.pow(epsilon, 3) / 6 - individualRent :
        epsilon * epsilon / 2 - Math.pow(epsilon, 3) / 4,
      sellerPayment: minimum ? epsilon * epsilon / 2 - Math.pow(epsilon, 3) / 3 + individualRent :
        epsilon * epsilon / 2 - Math.pow(epsilon, 3) / 4,
      revenue: revenue, threshold: threshold,
      // Allocation implementability is independent of the selected payment rule.
      implementable: gamma >= threshold,
      implementsEfficientAllocation: bic && (!minimum || gamma >= threshold),
      exAnteBB: !minimum || gamma >= threshold,
      exPostBB: !minimum || gamma >= epsilon,
      largestDeficit: minimum ? length * length / 2 : 0,
      buyerBIC: bic, sellerBIC: bic, bicThreshold: minimum ? 0 : epsilon / 2,
      buyerDSIC: gamma >= dsicThreshold, sellerDSIC: gamma >= dsicThreshold,
      dsicThreshold: dsicThreshold,
      buyerMaximumInterimGain: maximumInterimGain, sellerMaximumInterimGain: maximumInterimGain,
      buyerMaximumExPostGain: maximumExPostGain, sellerMaximumExPostGain: maximumExPostGain,
      buyerInterimIR: true, sellerInterimIR: true,
      buyerExPostIR: true, sellerExPostIR: true,
      expectedEfficiencyLoss: 0, largestEfficiencyLoss: 0
    });
    function field(name, x, y) {
      switch (name) {
        case "q": return q(x, y);
        case "pB": return pB(x, y);
        case "pS": return pS(x, y);
        case "buyerIC": return buyerDeviation(x, y);
        case "sellerIC": return sellerDeviation(x, y);
        case "revenue": return minimum ? (x - y) * q(x, y) - buyerRent(x) - sellerRent(y) : 0;
        case "buyerPayoff": return buyerPayoff(x, y);
        case "sellerPayoff": return sellerPayoff(x, y);
        case "efficiency": return 0;
        default: throw new Error("Unknown field: " + name);
      }
    }
    return Object.freeze({
      id: id, gamma: gamma, epsilon: epsilon,
      buyerSupport: buyerSupport, sellerSupport: sellerSupport,
      q: q, pB: pB, pS: pS, buyerAllocation: buyerAllocation, sellerAllocation: sellerAllocation,
      buyerRent: buyerRent, sellerRent: sellerRent,
      buyerPayment: buyerPayment, sellerPayment: sellerPayment,
      buyerDeviation: buyerDeviation, sellerDeviation: sellerDeviation,
      buyerExPostDeviation: buyerExPostDeviation, sellerExPostDeviation: sellerExPostDeviation,
      buyerBestReport: buyerBestReport, sellerBestReport: sellerBestReport,
      buyerBestReportTrace: reportTrace(buyerSupport, minimum ? undefined : a + 2 * gamma, buyerBestReport),
      sellerBestReportTrace: reportTrace(sellerSupport, minimum ? undefined : 1 - 2 * gamma, sellerBestReport),
      field: field, totals: totals
    });
  }
  var presets = Object.freeze({
    "minimum-rent": Object.freeze({ label: "Minimum-rent efficient mechanism", create: function (parameters) {
      return createRule(parameters, "minimum-rent");
    } }),
    "split-the-difference": Object.freeze({ label: "Split-the-difference", create: function (parameters) {
      return createRule(parameters, "split-the-difference");
    } })
  });
  global.LyingCostModel = Object.freeze({
    thresholdFactor: THRESHOLD_FACTOR, presets: presets,
    create: function (parameters, preset) {
      var definition = presets[preset || "minimum-rent"];
      if (!definition) { throw new Error("Unknown preset."); }
      return definition.create(parameters);
    }
  });
})(window);
