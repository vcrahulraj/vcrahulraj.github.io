(() => {
  "use strict";

  const accessReviews = {
    anika: {
      score: 38,
      band: "Medium",
      decision: "Review two entitlements",
      summary: "Most access matches the Finance Analyst role. Privileged reporting access and one entitlement unused for 120 days need manager confirmation.",
      findings: ["ERP reporting access matches the current role", "Privileged export permission needs manager confirmation", "Legacy finance share has been unused for 120 days"],
      email: "Please confirm whether Anika still requires the privileged export permission and legacy finance share. No access will be changed until the review is approved."
    },
    marcus: {
      score: 67,
      band: "High",
      decision: "Remove or justify elevated access",
      summary: "The contractor account has elevated access outside the expected support scope and an approaching end date. The access owner should review it promptly.",
      findings: ["Contractor end date is within 14 days", "Administrative group is outside the expected support role", "Two entitlements have no recent-use evidence"],
      email: "Please validate Marcus's administrative group membership before the contract end date. Remove access that is no longer required through the approved IAM process."
    },
    priya: {
      score: 94,
      band: "Critical",
      decision: "Escalate for immediate revocation review",
      summary: "A terminated identity retains privileged and shared-resource access. The prototype flags the record for urgent human review and ownership reassignment.",
      findings: ["Identity status is terminated", "Privileged directory access remains assigned", "Shared mailbox ownership requires reassignment"],
      email: "Please verify the termination record, revoke remaining access through approved controls, and assign a new owner for the shared mailbox."
    }
  };

  const otAlerts = {
    plc: {
      score: 82,
      severity: "Critical",
      escalation: "Immediate escalation",
      summary: "Repeated authentication failures affect a production PLC from an unfamiliar source. Validate the source, preserve evidence, and involve the OT security and operations teams.",
      actions: ["Confirm the asset and source address with the asset owner", "Review authentication and network telemetry for the same time window", "Escalate through the approved OT incident process; do not isolate the PLC without authorization"]
    },
    hmi: {
      score: 71,
      severity: "High",
      escalation: "Escalation required",
      summary: "The monitoring connection to a production HMI is unavailable. The loss of visibility needs operational validation and coordinated troubleshooting.",
      actions: ["Confirm whether the HMI is operational with the control-room contact", "Check upstream switch and monitoring-path availability", "Notify the responsible infrastructure and OT teams with timestamps and observed impact"]
    },
    historian: {
      score: 48,
      severity: "Medium",
      escalation: "Investigate and monitor",
      summary: "Traffic to the historian is slower than its normal baseline, but data flow continues. Validate the trend and check for network or system saturation.",
      actions: ["Compare current throughput with the approved baseline", "Check interface errors, latency, and host resource utilization", "Document findings and escalate if degradation continues or affects operations"]
    }
  };

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  const renderAccessReview = (data, note) => `
    <div class="demo-result-head">
      <div><span>Risk score</span><strong>${data.score}/100</strong></div>
      <div><span>Risk level</span><strong class="risk-${data.band.toLowerCase()}">${data.band}</strong></div>
      <div><span>Recommendation</span><strong>${data.decision}</strong></div>
    </div>
    <div class="demo-result-body">
      <h3>Review summary</h3><p>${data.summary}</p>
      <h3>Rule-based findings</h3><ul>${data.findings.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h3>Manager email draft</h3><p class="demo-draft">${data.email}</p>
      <p class="demo-context"><strong>Reviewer context:</strong> ${escapeHtml(note || "No additional note supplied.")}</p>
    </div>`;

  const renderOtTriage = (data, note) => `
    <div class="demo-result-head">
      <div><span>Risk score</span><strong>${data.score}/100</strong></div>
      <div><span>Severity</span><strong class="risk-${data.severity.toLowerCase()}">${data.severity}</strong></div>
      <div><span>Response</span><strong>${data.escalation}</strong></div>
    </div>
    <div class="demo-result-body">
      <h3>Assessment</h3><p>${data.summary}</p>
      <h3>Recommended analyst actions</h3><ol>${data.actions.map((item) => `<li>${item}</li>`).join("")}</ol>
      <h3>Escalation note</h3><p class="demo-draft">${escapeHtml(note || "Validate the alert and coordinate with the responsible team.")} Risk score: ${data.score}/100. No automated remediation was performed.</p>
    </div>`;

  document.querySelectorAll("[data-demo]").forEach((demo) => {
    const form = demo.querySelector("[data-demo-form]");
    const select = demo.querySelector("[data-demo-select]");
    const note = demo.querySelector("[data-demo-note]");
    const output = demo.querySelector("[data-demo-output]");
    if (!form || !select || !output) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const isAccessLens = demo.dataset.demo === "accesslens";
      const data = (isAccessLens ? accessReviews : otAlerts)[select.value];
      if (!data) return;
      output.innerHTML = isAccessLens
        ? renderAccessReview(data, note?.value.trim())
        : renderOtTriage(data, note?.value.trim());
      output.classList.add("has-result");
      output.focus({ preventScroll: true });
    });
  });
})();
